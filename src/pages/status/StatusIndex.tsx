import { Box, Stack } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import {
    TabItem,
    TabsContainerMainMenu,
    TabsContainerVertical,
} from "../../CoreComponents/TabsContainer";
import Docs from "./Docs";
import FFMPEGSettings from "./FFMPEGSettings";
import YoutubeDLSettings from "./YoutubeDLSettings";

export default function StatusIndex() {
    return (
        <Stack direction="row" height="100%" gap={1}>
            <Box>
                <TabsContainerVertical>
                    {/* To Docs */}
                    <TabItem value="docs/*" label="Docs" to="docs" />
                    {/* To ffmpeg */}
                    <TabItem value="ffmpeg/*" label="FFMPEG" to="ffmpeg" />
                    {/* To ytdlp */}
                    <TabItem value="ytdlp/*" label="YT-DLP" to="ytdlp" />
                </TabsContainerVertical>
            </Box>
            <Box>
                <Routes>
                    {/* docs page */}
                    <Route path="docs/*" element={<Docs></Docs>}></Route>
                    {/* ffmpeg page */}
                    <Route
                        path="ffmpeg/*"
                        element={<FFMPEGSettings></FFMPEGSettings>}
                    ></Route>
                    {/* ytdlp page */}
                    <Route
                        path="ytdlp/*"
                        element={<YoutubeDLSettings></YoutubeDLSettings>}
                    ></Route>
                    {/* on default route, redirect to docs */}
                    <Route
                        path="*"
                        element={<Navigate replace to="docs" />}
                    ></Route>
                </Routes>
            </Box>
        </Stack>
    );
}
