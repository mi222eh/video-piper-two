import { useState } from "react";
import "./App.css";
import VideoInfo from "./Components/VideoInfo";
import Input from "./CoreComponents/Input";

import styles from "./App.module.sass";
import { Link } from "react-router-dom";
import Index from "./pages/Index";
import { Box } from "@mui/system";
import { AppBar, Divider, Toolbar, Typography } from "@mui/material";
function App() {
    const [search, setSearch] = useState("");
    const [infoSearch, setInfoSearch] = useState<null | string>(null);

    return (
        <Box className={styles.body}>
            <AppBar position="static">
                <Toolbar>
                    <Typography>Video Piper 2</Typography>
                    <Divider orientation="vertical"></Divider>
                </Toolbar>
            </AppBar>

            {/* APP CONTENT */}
            <Index></Index>
        </Box>
    );
}

export default App;
