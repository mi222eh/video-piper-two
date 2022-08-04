import { Button, Card, FormLabel } from "@mui/material";
import { open } from "@tauri-apps/api/dialog";
import { downloadDir } from "@tauri-apps/api/path";
import { toNumber } from "lodash";
import { useState } from "react";
import Input from "../CoreComponents/Input";
import { useVideoHandler } from "../GlobalContexts/VideoHandler";
import { useVideoInfo } from "../GlobalContexts/YoutubedlContext";
import styles from "./VideoInfo.module.sass";

export default function VideoInfo(props: { url: string; onBack: () => void }) {
    const { data, error, loading } = useVideoInfo(props.url);
    const [folder, setFolder] = useState("");
    const [audioOnly, setaudioOnly] = useState(false);
    const [height, setheight] = useState(1080);
    const [width, setwidth] = useState(1920);
    const { addVideo, clear, isInProgress } = useVideoHandler();

    async function chooseFolder() {
        const folder = await open({
            directory: true,
            defaultPath: await downloadDir(),
            title: "Choose folder",
        });
        if (!folder || Array.isArray(folder)) return;
        setFolder(folder);
    }

    if (loading) return <>Loading</>;
    if (error) return <div>Error loading info</div>;
    if (!data) return <div>No data found</div>;

    return (
        <Card>
            <Button onClick={props.onBack}>Back</Button>
            <div className={styles.content}>
                <div className={styles.imgWrapper}>
                    <img
                        src={data?.thumbnail}
                        className={styles.thumbnail}
                        alt="thumbnail"
                    ></img>
                    <div>{data?.title}</div>
                </div>
                <div className={styles.form}>
                    <div className={styles.formLeft}>
                        <FormLabel>
                            Audio Only
                            <input
                                type={"checkbox"}
                                checked={audioOnly}
                                onChange={(event) =>
                                    setaudioOnly(event.target.checked)
                                }
                            ></input>
                        </FormLabel>
                    </div>

                    <div className={styles.formRight}>
                        <div className={styles.video}>
                            Video type Preset:
                            <Button
                                onClick={() => {
                                    setheight(1080);
                                    setwidth(1920);
                                }}
                            >
                                1080p
                            </Button>
                            <FormLabel className={styles.videoDimensions}>
                                Dimensions
                                <Input
                                    type={"number"}
                                    placeholder="width"
                                    value={width}
                                    onChange={(e) => {
                                        setwidth(toNumber(e.target.value));
                                    }}
                                ></Input>
                                X
                                <Input
                                    type={"number"}
                                    placeholder="height"
                                    value={height}
                                    onChange={(e) => {
                                        setheight(toNumber(e.target.value));
                                    }}
                                ></Input>
                            </FormLabel>
                        </div>
                        <FormLabel>
                            Directory
                            <Input
                                disabled
                                unselectable="on"
                                value={folder}
                            ></Input>
                            <Button onClick={chooseFolder}></Button>
                        </FormLabel>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        props.onBack();
                        addVideo({
                            audioOnly: audioOnly,
                            path: folder,
                            url: props.url,
                            width: width,
                            height: height,
                        });
                    }}
                >
                    Download
                </Button>
            </div>
        </Card>
    );
}
