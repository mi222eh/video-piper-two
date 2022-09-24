import { Alert, Box, Stack, Typography } from "@mui/material";
import { useYoutubeDlStatus } from "../../Services/youtubedl.services";

export default function YoutubeDLSettings() {
    const { isAvailable, version } = useYoutubeDlStatus();

    return (
        <Stack>
            <Box>
                {!isAvailable && (
                    <Alert severity="error">
                        yt-dlp is not available, please install it and/or
                        reference the .exe file
                    </Alert>
                )}
                {isAvailable && (
                    <Alert severity="success">yt-dlp is avilable</Alert>
                )}
            </Box>
            <Box margin="0 1rem">
                <Typography variant="h4">Version</Typography>
            </Box>
            <Box margin="0 1rem">
                <Typography variant="subtitle2"> {version}</Typography>
            </Box>
        </Stack>
    );
}
