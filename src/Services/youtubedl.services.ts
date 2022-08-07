import { Command, Child } from "@tauri-apps/api/shell";
import { proxy, useSnapshot } from "valtio";
import { IVideoInfo } from "../VideoInfo";
import { spawnExecCommand } from "./command.services";
import { getResourceDir } from "./folders.services";

const youtubeDlStatus = proxy({
    /**If youtube-dl is foud or not by the app */
    isAvailable: false,
    /**youtube-dl version */
    version: "",
});

export const useYoutubeDlStatus = () => {
    return useSnapshot(youtubeDlStatus);
};

export const isYoutubeDlAvailable = async () => {
    const { dataPromise } = await executeYoutubeDlChildProcess(["--version"]);

    try {
        const version = await dataPromise;
        youtubeDlStatus.version = version;
        youtubeDlStatus.isAvailable = true;
        console.log("youtube-dl is available");

        return true;
    } catch {
        youtubeDlStatus.isAvailable = false;
        youtubeDlStatus.version = "";
        console.log("youtube-dl is not available");
        return false;
    }
};

export const executeYoutubeDlCommand = async (args: string[]) => {
    const command = spawnExecCommand("youtube-dl", args, {
        cwd: await getResourceDir(),
    });
    return await (
        await command
    ).dataPromise;
};

export const executeYoutubeDlChildProcess = async function (args: string[]) {
    const { child, dataPromise } = await spawnExecCommand("youtube-dl", args, {
        cwd: await getResourceDir(),
    });

    return { child, dataPromise };
};

export const getInfoWithYoutubeDL = async (args: { url: string }) => {
    const { url } = args;
    const { child, dataPromise } = await executeYoutubeDlChildProcess([
        "-J",
        url,
    ]);
    return {
        child,
        dataPromise: dataPromise.then(
            (json) => JSON.parse(json as any) as IVideoInfo
        ),
    };
};

export const downloadWithYoutubeDL = async (args: {
    url: string;
    format: string;
    path: string;
}) => {
    const { format, path, url } = args;

    const { child, dataPromise } = await executeYoutubeDlChildProcess([
        "-f",
        format,
        "-o",
        path,
        "--no-part",
        url,
    ]);
    return { child, dataPromise };
};
