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

// export default function MainMenu() {
//     return (
//         <Stack direction="row">
//             <NavLink to={"/"} end>
//                 <MenuItem>
//                     <Typography textAlign="center">Download</Typography>
//                 </MenuItem>
//             </NavLink>
//             {/* <NavLink to="/stream">
//                                 <MenuItem>
//                                     <Typography textAlign="center">
//                                         Stream
//                                     </Typography>
//                                 </MenuItem>
//                             </NavLink> */}
//             <NavLink to={"/ffmpeg"}>
//                 <MenuItem>
//                     <Typography textAlign="center">FFMPEG</Typography>
//                 </MenuItem>
//             </NavLink>
//             <NavLink to={"/youtube-dl"}>
//                 <MenuItem>
//                     <Typography textAlign="center">YT-DLP</Typography>
//                 </MenuItem>
//             </NavLink>
//             <NavLink to="/docs">
//                 <MenuItem>
//                     <Typography textAlign="center">Docs</Typography>
//                 </MenuItem>
//             </NavLink>
//         </Stack>
//     );
// }
