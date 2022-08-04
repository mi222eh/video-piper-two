import { spawnExecCommand } from "./command.services";

export const killCommand = async (pid: number) => {
    // taskkill /PID PID /F

    const { child, dataPromise } = await spawnExecCommand("taskKill", [
        "/PID",
        pid.toString(),
        "/T",
        "/F",
    ]);

    await dataPromise;
};
