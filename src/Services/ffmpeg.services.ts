import { Command } from "@tauri-apps/api/shell";
import { proxy, useSnapshot } from "valtio";
import { spawnExecCommand } from "./command.services";
import { getResourceDir } from "./folders.services";

const ffmpegSettings = proxy({
    directory: "./",
});

const ffmpegStatus = proxy({
    version: "",
    isAvailable: false,
});

export const useFFMPEGStatus = () => {
    return useSnapshot(ffmpegStatus);
};

export const isFFMPEGAvailable = async () => {
    const { child, dataPromise } = await executeFFMPEG(["-version"]);
    try {
        const version = await dataPromise;
        ffmpegStatus.isAvailable = true;
        ffmpegStatus.version = version;
        console.log("ffmpeg is available");
        return true;
    } catch {
        ffmpegStatus.isAvailable = false;
        ffmpegStatus.version = "N/A";
        console.log("ffmpeg is not available");
        return false;
    }
};

export const executeFFMPEG = async (args: string[]) => {
    const command = await spawnExecCommand("ffmpeg", args, {
        cwd: ffmpegSettings.directory,
    });
    return command;
};

export const convertFileWithFFmpeg = async (args: {
    fromPath: string;
    toPath: string;
}) => {
    const { fromPath, toPath } = args;
    console.log("Converting");
    console.log("From", fromPath);
    console.log("To", toPath);
    const command = await spawnExecCommand("ffmpeg", ["-i", fromPath, toPath], {
        cwd: await getResourceDir(),
    });
    return command;
};

export const convertFileWithFFmpegExecute = async (args: {
    fromPath: string;
    toPath: string;
}) => {
    const { fromPath, toPath } = args;
    console.log("Converting");
    console.log("From", fromPath);
    console.log("To", toPath);

    return await spawnExecCommand("ffmpeg", ["-i", fromPath, toPath], {
        cwd: await getResourceDir(),
    });
};

export const combineWithFFMPEG = async (args: {
    input1: string;
    input2: string;
    output: string;
}) => {
    const { child, dataPromise } = await spawnExecCommand("ffmpeg", [
        "-i",
        args.input1,
        "-i",
        args.input2,
        args.output,
    ]);

    return { child, dataPromise };
};
