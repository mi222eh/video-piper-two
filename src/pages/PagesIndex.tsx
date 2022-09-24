import { Route, Routes } from "react-router-dom";
import DownloadVideo from "../Components/DownloadVideo";
import Docs from "./status/Docs";
import FFMPEGSettings from "./status/FFMPEGSettings";
import StatusIndex from "./status/StatusIndex";
import YoutubeDLSettings from "./status/YoutubeDLSettings";
import Stream from "./Stream";

export default function Index() {
    return (
        <Routes>
            <Route path="*" element={<DownloadVideo></DownloadVideo>}></Route>
            <Route path="stream" element={<Stream></Stream>}></Route>
            {/* Status Page */}
            <Route
                path="status/*"
                element={<StatusIndex></StatusIndex>}
            ></Route>
        </Routes>
    );
}
