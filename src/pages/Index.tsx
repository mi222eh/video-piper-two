import { Route, Routes } from "react-router-dom";
import DownloadVideo from "../Components/DownloadVideo";
import Docs from "./Docs";
import FFMPEGSettings from "./FFMPEGSettings";
import Stream from "./Stream";
import YoutubeDLSettings from "./YoutubeDLSettings";

export default function Index() {
    return (
        <Routes>
            <Route path="*" element={<DownloadVideo></DownloadVideo>}></Route>
            <Route path="stream" element={<Stream></Stream>}></Route>
            <Route
                path="ffmpeg"
                element={<FFMPEGSettings></FFMPEGSettings>}
            ></Route>
            <Route
                path="youtube-dl"
                element={<YoutubeDLSettings></YoutubeDLSettings>}
            ></Route>
            <Route path="docs" element={<Docs></Docs>}></Route>
        </Routes>
    );
}
