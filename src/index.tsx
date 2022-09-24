import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalContexts from "./GlobalContexts";
import { Box } from "@mui/material";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Box
            width="100vw"
            height="100vh"
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <GlobalContexts>
                <App />
            </GlobalContexts>
        </Box>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
