import { createDir } from "@tauri-apps/api/fs";
import {
    appDir,
    dataDir,
    join,
    localDataDir,
    publicDir,
    resourceDir,
} from "@tauri-apps/api/path";

/**
 * Return the local data directory on the user's pc
 */
export const getLocalDataDirectory = async () => {
    return await localDataDir();
};

/**
 * Returns the main directory where data should be saved
 */
export const getMainDataDir = async () => {
    return await join(await getLocalDataDirectory(), "vdeo_piper_2");
};

/**
 * Gets the directory where to save the configs
 */
export const getAppDir = async () => {
    return await appDir();
};

/**
 * Gets the directory of the user's global data
 */

export const getDataDir = async () => {
    return await dataDir();
};

/**
 * Returns the public directory
 */
export const getPublicDir = async () => {
    return await publicDir();
};

/**
 * Returns the path to the resource directory
 */
export const getResourceDir = async () => {
    return (await resourceDir()).replaceAll("\\\\?\\", "");
};

export const createMainDir = async () => {
    await createDir(await getMainDataDir(), {
        recursive: true,
    });
};
