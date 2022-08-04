import { ReactNode } from "react";
import { HashRouter } from "react-router-dom";
import { FolderContextProvider } from "./GlobalContexts/FoldersContext";
import VideoHandler from "./GlobalContexts/VideoHandler";
import { YoutubeDlContextProvider } from "./GlobalContexts/YoutubedlContext";

export default function GlobalContexts(props: { children: ReactNode }) {
    return (
        <HashRouter>
            <FolderContextProvider>
                <YoutubeDlContextProvider>
                    <VideoHandler>{props.children}</VideoHandler>
                </YoutubeDlContextProvider>
            </FolderContextProvider>
        </HashRouter>
    );
}
