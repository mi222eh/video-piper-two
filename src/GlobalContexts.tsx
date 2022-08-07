import { ReactNode } from "react";
import { HashRouter } from "react-router-dom";
import { FolderContextProvider } from "./GlobalContexts/FoldersContext";
import { StatusChecker } from "./GlobalContexts/StatusChecker";
import VideoHandler from "./GlobalContexts/VideoHandler";
import { YoutubeDlContextProvider } from "./GlobalContexts/YoutubedlContext";

export default function GlobalContexts(props: { children: ReactNode }) {
    return (
        <HashRouter>
            <FolderContextProvider>
                <YoutubeDlContextProvider>
                    <StatusChecker>
                        <VideoHandler>{props.children}</VideoHandler>
                    </StatusChecker>
                </YoutubeDlContextProvider>
            </FolderContextProvider>
        </HashRouter>
    );
}
