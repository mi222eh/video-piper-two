import { Child, Command, SpawnOptions } from "@tauri-apps/api/shell";
import { remove } from "lodash";
import { proxy, useSnapshot } from "valtio";

interface ActiveProcess {
    process: Child;
    output: string;
    pid: number;
    program: string;
}

const currentActiveCommand = proxy({
    processList: [] as ActiveProcess[],
});

const activeCommandHistory = proxy({
    processList: [] as ActiveProcess[],
});

export const useActiveProcesses = () => {
    return useSnapshot(currentActiveCommand).processList;
};

export const useProcessHistory = () => {
    return useSnapshot(activeCommandHistory).processList;
};

/**Spawns a child command, executes it, returns the child process and a promise that resolves to the data it outputs */
export const spawnExecCommand = async function <T>(
    program: string,
    args?: string[] | string,
    opts?: SpawnOptions
) {
    console.log(`Executing "${program}" with args "${args}" and opts:`, opts);

    /**General command */
    const command = new Command(program, args, {
        ...opts,
    });

    /**data sent through the out */
    let data = "";
    /**data sent through the err */
    let dataError = "";

    /**The process id */
    let pid = NaN;

    /**listener function, for the promise */
    let onClose: (args: any) => void;
    command.stdout.on("data", (arg) => {
        console.log(`Data from "${program}"`, arg);
        data += arg;
    });
    command.stderr.on("data", (arg) => {
        console.log(`Data Error from "${program}"`, arg);
        dataError += arg;
    });
    command.on("close", (arg) => onClose?.(arg));

    command.on("close", () => {
        console.log(`Process "${program}" is closing`);

        const processList = currentActiveCommand.processList.filter(
            (x) => x.pid == pid
        );

        currentActiveCommand.processList =
            currentActiveCommand.processList.filter((x) => x.pid === pid);
        activeCommandHistory.processList = [
            ...processList,
            ...activeCommandHistory.processList,
        ];
    });

    /**the child process */
    const child = command.spawn();

    child.then((proc) => {
        pid = proc.pid;
        currentActiveCommand.processList = [
            ...currentActiveCommand.processList,
            {
                output: "",
                process: proc,
                pid: proc.pid,
                program: program,
            },
        ];
    });

    return {
        child: await child,
        dataPromise: new Promise<string>(async (res, rej) => {
            onClose = (args) => {
                if (args.code === 0) res(data);
                else rej(dataError ?? data);
            };
        }),
    };
};
