import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";

interface WindDrawerProps {
    selectedWind: number | null; // Level 0–3
    onSelectWind: (level: number) => void;
    drawerWidth?: number;
    offsetTop?: string; // now a CSS unit string like "20rem"
}

const windLevels = [
    { level: 1, label: "Calm", icon: "/wind/WindSockAnim1.gif" },
    { level: 2, label: "Light Breeze", icon: "/wind/WindSockAnim2.gif" },
    { level: 3, label: "Strong Breeze", icon: "/wind/WindSockAnim3.gif" },
    { level: 4, label: "Gale", icon: "/wind/WindSockAnim4.gif" }
];

export const WindDrawer = ({ selectedWind, onSelectWind, drawerWidth = 240, offsetTop = "28.5rem" }: WindDrawerProps) => {
    return (
        <Drawer
            anchor="right"
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    bgcolor: "#222",
                    color: "#fff",
                    top: offsetTop, // uses rem, not px
                    height: `calc(100% - ${offsetTop})`,
                    borderTop: "0.0625rem solid #444"
                }
            }}
        >
            <Typography variant="h6" sx={{ p: 2 }}>
                Wind
            </Typography>
            <List>
                {windLevels.map((wind) => (
                    <ListItem key={wind.level} disablePadding>
                        <ListItemButton
                            selected={selectedWind === wind.level}
                            onClick={() => onSelectWind(wind.level)}
                            sx={{
                                "&.Mui-selected": {
                                    bgcolor: "rgba(255,255,255,0.1)"
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: "5.5rem" }}>
                                <img src={wind.icon} alt={wind.label} style={{ width: "5rem", height: "5rem" }} />
                            </ListItemIcon>
                            <ListItemText primary={wind.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};
