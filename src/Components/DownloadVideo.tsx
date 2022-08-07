import { Folder } from "@mui/icons-material";
import {
    Box,
    Button,
    Checkbox,
    FormLabel,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { open } from "@tauri-apps/api/dialog";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useVideoHandler } from "../GlobalContexts/VideoHandler";
import { useFFMPEGStatus } from "../Services/ffmpeg.services";
import { useYoutubeDlStatus } from "../Services/youtubedl.services";
import NotAvailable from "./NotAvailable";

const validationSchema = yup.object({
    audioOnly: yup.boolean().default(false),
    width: yup
        .number()
        .default(1920)
        .positive("Width must be a positive number")
        .when("audioOnly", function (audioOnly: boolean) {
            return this.notRequired();
        }),
    height: yup
        .number()
        .default(1080)
        .positive("Height must be a positive number")
        .when("audioOnly", function (audioOnly: boolean) {
            return this.notRequired();
        }),

    url: yup.string().default("").url("Must be a valid url"),
    folder: yup.string().default("").required(),
});

export default function DownloadVideo() {
    const { isAvailable: isYtdlAvailable } = useYoutubeDlStatus();
    const { isAvailable: isffmpegAvailable } = useFFMPEGStatus();

    const { addVideo } = useVideoHandler();

    async function chooseFolder() {
        const folder = await open({
            directory: true,
            // defaultPath: await downloadDir(),
            title: "Choose folder",
        });
        if (!folder || Array.isArray(folder)) return;
        return folder;
    }

    if (!isYtdlAvailable || !isffmpegAvailable)
        return <NotAvailable></NotAvailable>;

    return (
        <Formik
            initialValues={validationSchema.getDefault()}
            onSubmit={(values, form) => {
                addVideo({
                    audioOnly: values.audioOnly,
                    height: values.height,
                    path: values.folder,
                    url: values.url,
                    width: values.width,
                });
            }}
            validationSchema={validationSchema}
        >
            {({ values, setFieldValue }) => {
                return (
                    <Form>
                        <Box>
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                flexDirection={"column"}
                            >
                                {/* <Button
                                    onClick={() =>
                                        setFieldValue(
                                            "url",
                                            "https://www.youtube.com/watch?v=a9Y1ZryyDQw"
                                        )
                                    }
                                >
                                    Insert example url
                                </Button> */}

                                <Box
                                    display="flex"
                                    width={"70vw"}
                                    marginTop="12px"
                                >
                                    <TextField
                                        label="URL"
                                        variant="outlined"
                                        sx={{ width: "70vw" }}
                                        type={"text"}
                                        value={values.url}
                                        onChange={(x) =>
                                            setFieldValue("url", x.target.value)
                                        }
                                    />
                                </Box>
                                <Box
                                    display="flex"
                                    width={"70vw"}
                                    marginTop="12px"
                                >
                                    <TextField
                                        sx={{ flexGrow: "1" }}
                                        disabled
                                        label="Folder"
                                        value={values.folder}
                                    ></TextField>
                                    <IconButton
                                        onClick={async () => {
                                            const folder = await chooseFolder();
                                            if (!folder) return;
                                            setFieldValue("folder", folder);
                                        }}
                                    >
                                        <Folder></Folder>
                                        <Typography>Choose</Typography>
                                    </IconButton>
                                </Box>
                                <Box>
                                    <FormLabel
                                        sx={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        Audio only
                                        <Checkbox
                                            checked={values.audioOnly}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "audioOnly",
                                                    e.target.checked
                                                )
                                            }
                                        ></Checkbox>
                                    </FormLabel>

                                    <Box>
                                        <Box>
                                            <FormLabel>
                                                Max resolution
                                            </FormLabel>
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            marginTop="0.5rem"
                                        >
                                            <TextField
                                                type={"number"}
                                                label="Width"
                                                value={values.width}
                                                disabled={values.audioOnly}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        "width",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            ></TextField>
                                            <Typography>X</Typography>
                                            <TextField
                                                type={"number"}
                                                disabled={values.audioOnly}
                                                value={values.height}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        "height",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                label="Height"
                                            ></TextField>
                                        </Box>
                                    </Box>
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        marginTop: "12px",
                                    }}
                                >
                                    Download
                                </Button>
                            </Box>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
}
