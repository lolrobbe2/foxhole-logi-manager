import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { ArtilleryGun, artilleryGuns } from "./artilleryGuns";

interface GunDrawerProps {
    selectedGun: ArtilleryGun | null;
    onSelectGun: (gun: ArtilleryGun) => void;
    drawerWidth?: string;  // responsive unit like "15rem"
    drawerHeight?: string; // responsive unit like "18.75rem"
}

export const GunDrawer = ({ selectedGun, onSelectGun, drawerWidth = "15rem", drawerHeight = "28.75rem" }: GunDrawerProps) => {
    return (
        <Drawer
            anchor="right"
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    height: drawerHeight, // fixed size but scalable
                    boxSizing: "border-box",
                    bgcolor: "#222",
                    color: "#fff",
                    overflow: "hidden", // prevent drawer from scrolling
                }
            }}
        >
            <Typography variant="h6" sx={{ p: 2 }}>
                Select Gun
            </Typography>
            <List
                sx={{
                    overflowY: "auto", // only the list scrolls
                    flexGrow: 1,
                    pr: "0.5rem" // space for scrollbar
                }}
            >
                {artilleryGuns.map((gun) => {
                    const borderColor =
                        gun.faction === "Colonials"
                            ? "limegreen"
                            : gun.faction === "Wardens"
                                ? "dodgerblue"
                                : "gray";

                    return (
                        <ListItem key={gun.name} disablePadding>
                            <ListItemButton
                                selected={selectedGun?.name === gun.name}
                                onClick={() => onSelectGun(gun)}
                                sx={{
                                    border: `0.125rem solid ${borderColor}`,
                                    borderRadius: "0.5rem",
                                    m: "0.5rem",
                                    "&.Mui-selected": {
                                        bgcolor: "rgba(255,255,255,0.1)"
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={gun.name}
                                    secondary={`${gun.faction} | ${gun.mindistance}-${gun.maxdistance}m`}
                                    secondaryTypographyProps={{ color: "gray" }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};
