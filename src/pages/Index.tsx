import { Route, Routes } from "react-router-dom";
import DownloadVideo from "./DownloadVideo";

export default function Index() {
    return (
        <Routes>
            <Route path="*" element={<DownloadVideo></DownloadVideo>}></Route>
        </Routes>
    );
}
