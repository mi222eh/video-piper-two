// import "./App.css";

import Index from "./pages/PagesIndex";
import { Box } from "@mui/system";
import { AppBar, Divider, Toolbar, Typography } from "@mui/material";
import MainMenu from "./MainMenu";
function App() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography>Video Piper 2</Typography>
                    <Divider
                        orientation="vertical"
                        sx={{ margin: "0 0.5rem" }}
                    ></Divider>
                    <MainMenu />
                </Toolbar>
            </AppBar>

            {/* APP CONTENT */}
            <Index></Index>
        </>
    );
}

export default App;
