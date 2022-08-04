import { useHookstate } from "@hookstate/core";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { copyFile, removeFile, renameFile } from "@tauri-apps/api/fs";
import { extname, join } from "@tauri-apps/api/path";
import { Child } from "@tauri-apps/api/shell";
import _, { last } from "lodash";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import sanitize from "sanitize-filename";
import { useActiveProcesses } from "../Services/command.services";
import {
    combineWithFFMPEG,
    convertFileWithFFmpeg,
    convertFileWithFFmpegExecute,
} from "../Services/ffmpeg.services";
import { killCommand } from "../Services/taskkill.sercvices";
import {
    doesFormatHaveAudio,
    getAllAudioFormats,
    getAllVideoFormats,
    getFormatVideoHeight,
    getFormatVideoWidth,
    getOnlyAudioFormats,
} from "../Services/videoinfo.services";
import {
    downloadWithYoutubeDL,
    getInfoWithYoutubeDL,
} from "../Services/youtubedl.services";
import { EXT, IVideoInfo } from "../VideoInfo";

import styles from "./VideoHandler.module.sass";

export enum EVideoFormat {
    UltraHD = "4K",
    FullHD = "1080P",
    None = "none",
}

interface AddVideoOption {
    url: string;
    audioOnly: boolean;
    width: number;
    height: number;
    path: string;
}

interface IVideoHandler {
    isInProgress: boolean;
    addVideo: (args: AddVideoOption) => void;
    clear: () => void;
}

const context = createContext({} as IVideoHandler);

export const useVideoHandler = () => {
    return useContext(context);
};

export default function VideoHandler(props: { children: ReactNode }) {
    /**State of the current video options */
    const currentVideo = useHookstate<AddVideoOption | null>(null);
    /**Status text */
    const status = useHookstate("");
    /**The current process */
    const currentProcess = useHookstate<Child | null>(null);
    /**The list of files downlaoded */
    const fileList = useHookstate<string[]>([]);
    /**If it is cancelled */
    const isCancelled = useHookstate(false);
    /**If it is still in progess of downloading / Converting */
    const isInProgress = useHookstate(false);

    const errored = useHookstate(false);

    const outputPath = useHookstate("");

    const activeProcesses = useActiveProcesses();

    async function handleVideo(args: AddVideoOption) {
        console.log(`Starting to download video`);
        console.log(`Path is "${args.path}"`);

        status.set("Getting info");
        const { child, dataPromise } = await getInfoWithYoutubeDL({
            url: args.url,
        });

        currentProcess.set(child);
        const info = await dataPromise;

        if (!info) {
            throw new Error("Info data is undefined");
        }

        const filenameNoExt = sanitize(info.title ?? " ");

        outputPath.set(
            await join(
                args.path,
                `${filenameNoExt}.${args.audioOnly ? "mp3" : "mp4"}`
            )
        );
        // if audio only, just get audio
        if (args.audioOnly) {
            console.log("Its only audio");

            /**Format of the audio */
            const format = last(getOnlyAudioFormats(info));
            if (!format) throw new Error("Audio format not found");

            console.log(`Found format "${format.format_id}"`);

            /**Filename to save as */
            const filename = `${filenameNoExt}.${format.ext}`;

            console.log(`Filename is goind to be "${filename}"`);

            /**Audio file path */
            const audioFilePath = await join(args.path, filename);
            console.log(`Downloading to ${audioFilePath}`);
            const { child, dataPromise } = await downloadWithYoutubeDL({
                format: format.format_id,
                path: audioFilePath,
                url: args.url,
            });
            currentProcess.set(child);

            fileList.set([...fileList.get(), audioFilePath]);
            status.set("Downloading audio");
            await dataPromise;

            if (format.ext !== EXT.Mp3) {
                const fromPath = audioFilePath;
                const toPathFilename = outputPath.get();

                const { child, dataPromise } = await convertFileWithFFmpeg({
                    fromPath,
                    toPath: toPathFilename,
                });
                currentProcess.set(child);

                status.set("Converting audio");
                await dataPromise;
            } else {
                status.set("Moving file");
                renameFile(audioFilePath, outputPath.get());
            }
        }
        // else if video
        else {
            /**The filename with no ext */
            const filenameNoExt = sanitize(info.title ?? " ");
            /**Biggest video format */
            const videoFormat = last(
                getAllVideoFormats(info).filter(
                    (f) =>
                        getFormatVideoWidth(f) <= args.width &&
                        getFormatVideoHeight(f) <= args.height
                )
            );
            /**Biggest audio format */
            const audioFormat = last(getOnlyAudioFormats(info));
            if (!videoFormat) {
                throw new Error("No video format was found");
            }
            /**If the current video format has audio */
            const videoHasAudio = doesFormatHaveAudio(videoFormat);

            const videoFilePath = await join(
                args.path,
                `${filenameNoExt}.${videoFormat.ext}`
            );

            const { child, dataPromise } = await downloadWithYoutubeDL({
                url: args.url,
                format: videoFormat.format_id,
                path: videoFilePath,
            });
            currentProcess.set(child);

            status.set("Downloading video");
            fileList.set([...fileList.get(), videoFilePath]);
            await dataPromise;

            if (!videoHasAudio) {
                if (!audioFormat) throw new Error("No audio was found");
                const audiofilePath = await join(
                    args.path,
                    `${filenameNoExt}.${audioFormat.ext}`
                );
                const { child, dataPromise } = await downloadWithYoutubeDL({
                    url: args.url,
                    format: audioFormat?.format_id,
                    path: audiofilePath,
                });
                currentProcess.set(child);

                status.set("Downloading audio");
                fileList.set([...fileList.get(), audiofilePath]);

                await dataPromise;
            }

            // if two files, combine
            // if only one, check extension and meyb convert
            if (fileList.length === 2) {
                // two means one audio and one video
                const { child, dataPromise } = await combineWithFFMPEG({
                    input1: fileList.get()[0],
                    input2: fileList.get()[1],
                    output: outputPath.get(),
                });
                currentProcess.set(child);

                status.set("Combining video and audio");
                await dataPromise;
            } else {
                // else its probably just one, which is combined
                if (outputPath.get() !== videoFilePath) {
                    const { child, dataPromise } = await convertFileWithFFmpeg({
                        fromPath: videoFilePath,
                        toPath: outputPath.get(),
                    });
                    currentProcess.set(child);

                    status.set("Converting video");
                    await dataPromise;
                }
            }
        }
        console.log("Finished");
        status.set("Finished");
    }

    function clear() {
        const current = currentProcess.ornull;
        if (current) {
            killCommand(current.pid.get());
        }
        isCancelled.set(true);
        status.set("Cancelled");
    }

    function close() {
        isInProgress.set(false);
    }

    return (
        <context.Provider
            value={{
                clear: clear,
                addVideo(args) {
                    currentVideo.set(null);
                    status.set("");
                    /**The current process */
                    currentProcess.set(null);
                    /**The list of files downlaoded */
                    fileList.set([]);
                    /**If it is cancelled */
                    isCancelled.set(false);
                    /**If it is still in progess of downloading / Converting */
                    isInProgress.set(false);
                    errored.set(false);
                    outputPath.set("");
                    currentVideo.set(args);
                    isInProgress.set(true);

                    handleVideo(args)
                        .catch((err) => {
                            console.error(err);
                            errored.set(true);
                        })
                        .then(() => {})
                        .finally(() => {
                            currentVideo.set(null);
                            fileList.get().forEach((file) => {
                                removeFile(file);
                            });
                        });
                },
                isInProgress: currentVideo !== null,
            }}
        >
            <>
                {props.children}
                {isInProgress.get() && (
                    <Box className={styles.wrap}>
                        <Box
                            className={styles.content}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box>
                                {!errored.get() && currentVideo.get() && (
                                    <CircularProgress></CircularProgress>
                                )}
                            </Box>
                            <Box>
                                {(() => {
                                    if (!isCancelled.get() && errored.get())
                                        return (
                                            <Typography color="red">
                                                An error has occured
                                            </Typography>
                                        );
                                    return (
                                        <Typography>{status.get()}</Typography>
                                    );
                                })()}
                            </Box>
                            {/* <Box>
                                <Typography>
                                    Save lovation: {outputPath.get()}
                                </Typography>
                            </Box> */}
                            {/* <Box>
                                <Typography>Active processes</Typography>
                                <ul>
                                    {activeProcesses.map((proc) => (
                                        <li key={proc.pid}>
                                            {proc.program}({proc.pid})
                                        </li>
                                    ))}
                                </ul>
                            </Box> */}
                            {/* <Box>
                                <Typography>File list</Typography>
                                <ul>
                                    {fileList.get().map((file) => (
                                        <li key={file}>{file}</li>
                                    ))}
                                </ul>
                            </Box> */}
                            <Box>
                                {!isCancelled.get() &&
                                    !errored.get() &&
                                    currentVideo.get() && (
                                        <Button onClick={clear}>Cancel</Button>
                                    )}
                                {(isCancelled.get() ||
                                    errored.get() ||
                                    !currentVideo.get()) && (
                                    <Button onClick={close}>Close</Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </>
        </context.Provider>
    );
}
