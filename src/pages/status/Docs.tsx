import { List, ListItem, Typography } from "@mui/material";

export default function Docs() {
    return (
        <>
            <Typography variant="h5">Dependencies</Typography>
            <List>
                <ListItem>youtube-dl</ListItem>
                <ListItem>FFMPEG</ListItem>
            </List>
            <Typography>
                Either install the above dependenvy with chocolately, or
                download the binaries and refrence them in the pah variables
            </Typography>
        </>
    );
}
