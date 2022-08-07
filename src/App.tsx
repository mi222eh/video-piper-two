import { useState } from "react";
import "./App.css";
import VideoInfo from "./Components/VideoInfo";
import Input from "./CoreComponents/Input";

import styles from "./App.module.sass";
import { Link, NavLink } from "react-router-dom";
import Index from "./pages/Index";
import { Box } from "@mui/system";
import {
    AppBar,
    Divider,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
function App() {
    return (
        <Box className={styles.body}>
            <AppBar position="static">
                <Toolbar>
                    <Typography>Video Piper 2</Typography>
                    <Divider
                        orientation="vertical"
                        sx={{ margin: "0 0.5rem" }}
                    ></Divider>
                    <MenuList variant="selectedMenu">
                        <Stack direction="row">
                            <NavLink to={"/"} end>
                                <MenuItem>
                                    <Typography textAlign="center">
                                        Download
                                    </Typography>
                                </MenuItem>
                            </NavLink>
                            <NavLink to={"/ffmpeg"}>
                                <MenuItem>
                                    <Typography textAlign="center">
                                        FFMPEG
                                    </Typography>
                                </MenuItem>
                            </NavLink>
                            <NavLink to={"/youtube-dl"}>
                                <MenuItem>
                                    <Typography textAlign="center">
                                        Youtube DL
                                    </Typography>
                                </MenuItem>
                            </NavLink>
                        </Stack>
                    </MenuList>
                </Toolbar>
            </AppBar>

            {/* APP CONTENT */}
            <Index></Index>
        </Box>
    );
}

export default App;
