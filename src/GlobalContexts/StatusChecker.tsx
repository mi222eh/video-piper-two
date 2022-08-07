import { useHookstate } from "@hookstate/core";
import { CircularProgress } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { isFFMPEGAvailable } from "../Services/ffmpeg.services";
import { isYoutubeDlAvailable } from "../Services/youtubedl.services";

export function StatusChecker(props: { children: ReactNode }) {
    const isLoading = useHookstate(true);

    useEffect(() => {
        isYoutubeDlAvailable()
            .then(() => {
                return isFFMPEGAvailable();
            })
            .then(() => {
                isLoading.set(false);
            });
    }, []);

    if (isLoading.get()) return <CircularProgress></CircularProgress>;

    return <>{props.children}</>;
}
