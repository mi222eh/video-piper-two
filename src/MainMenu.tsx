import { MenuItem, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { TabItem, TabsContainerMainMenu } from "./CoreComponents/TabsContainer";

export default function MainMenu() {
    return (
        <Stack direction="row">
            <TabsContainerMainMenu>
                <TabItem label="Download" to="/" value="" />
                {/* Tab Item To Status */}
                <TabItem value="status/*" label="Status" to="/status" />
            </TabsContainerMainMenu>
        </Stack>
    );
}
