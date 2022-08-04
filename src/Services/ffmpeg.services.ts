import { Command } from "@tauri-apps/api/shell";
import { spawnExecCommand } from "./command.services";
import { getResourceDir } from "./folders.services";

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
