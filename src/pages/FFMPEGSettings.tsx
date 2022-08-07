import { CheckBox } from "@mui/icons-material";
import { Alert, Checkbox, FormLabel, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFFMPEGStatus } from "../Services/ffmpeg.services";

export default function FFMPEGSettings() {
    const { isAvailable, version } = useFFMPEGStatus();

    return (
        <Stack>
            <Box>
                {!isAvailable && (
                    <Alert severity="error">
                        FFMPEG is not available, please install it and/or
                        reference the .exe file
                    </Alert>
                )}
                {isAvailable && (
                    <Alert severity="success">FFMPEG is avilable</Alert>
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
