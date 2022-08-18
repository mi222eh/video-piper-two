import { hookstate } from "@hookstate/core";
import { Button, Input, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
    get1080PFormats,
    getOnlyAudioFormats,
} from "../Services/videoinfo.services";
import {
    getFormatInfoWithYoutubeDL,
    getInfoWithYoutubeDL,
} from "../Services/youtubedl.services";
import { Acodec, Format } from "../VideoInfo";

const validationSchema = yup.object({
    url: yup.string().url().required().default(""),
});

export default function Stream() {
    const videoFormatState = hookstate<Format | null>(null);
    const audioFormatState = hookstate<Format | null>(null);

    return (
        <Formik
            initialValues={validationSchema.getDefault()}
            validationSchema={validationSchema}
            onSubmit={async (values, form) => {
                form.setSubmitting(true);
                videoFormatState.set(null);
                audioFormatState.set(null);
                try {
                    const result = await getInfoWithYoutubeDL({
                        url: values.url,
                    });
                    const { child, dataPromise } = result;

                    const info = await dataPromise;

                    const [video] = get1080PFormats(info);
                    videoFormatState.set(video);

                    if (video.acodec === Acodec.None) {
                        audioFormatState.set(getOnlyAudioFormats(info)[0]);
                    }
                } catch {
                } finally {
                    form.setSubmitting(false);
                }
            }}
        >
            {({ values, handleChange }) => {
                return (
                    <Form>
                        <Stack direction="column" padding="1rem" gap="1rem">
                            <TextField
                                variant="filled"
                                size="small"
                                value={values.url}
                                onChange={handleChange}
                                name="url"
                                label="URL"
                            ></TextField>
                            <Button type="submit" variant="contained">
                                Stream
                            </Button>
                            <video controls>
                                {videoFormatState.get() && (
                                    <source
                                        src={videoFormatState.get()?.url}
                                        type={`video/${
                                            videoFormatState.get()?.ext
                                        }`}
                                    ></source>
                                )}
                                {audioFormatState.get() && (
                                    <source
                                        src={audioFormatState.get()?.url}
                                        type={`video/${
                                            audioFormatState.get()?.ext
                                        }`}
                                    ></source>
                                )}
                            </video>
                        </Stack>
                    </Form>
                );
            }}
        </Formik>
    );
}
