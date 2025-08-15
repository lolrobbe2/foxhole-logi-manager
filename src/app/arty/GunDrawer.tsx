import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { ArtilleryGun, artilleryGuns } from "./artilleryGuns";

interface GunDrawerProps {
    selectedGun: ArtilleryGun | null;
    onSelectGun: (gun: ArtilleryGun) => void;
    drawerWidth?: number;
}

export const GunDrawer = ({ selectedGun, onSelectGun, drawerWidth = 240 }: GunDrawerProps) => {
    return (
        <Drawer
            anchor="right"
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", bgcolor: "#222", color: "#fff" }
            }}
        >
            <Typography variant="h6" sx={{ p: 2 }}>
                Select Gun
            </Typography>
            <List>
                {artilleryGuns.map((gun) => (
                    <ListItem key={gun.name} disablePadding>
                        <ListItemButton
                            selected={selectedGun?.name === gun.name}
                            onClick={() => onSelectGun(gun)}
                        >
                            <ListItemText
                                primary={gun.name}
                                secondary={`${gun.faction} | ${gun.mindistance}-${gun.maxdistance}m`}
                                secondaryTypographyProps={{ color: "gray" }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};
