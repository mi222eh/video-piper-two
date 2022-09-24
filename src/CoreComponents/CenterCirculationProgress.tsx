import { CircularProgress } from "@mui/material";
import { Center } from "./Center";

/**
 * A component that centers its children and displays a circular progress
 */
export function CenterCirculationProgress() {
    return (
        <Center>
            <CircularProgress></CircularProgress>
        </Center>
    );
}
