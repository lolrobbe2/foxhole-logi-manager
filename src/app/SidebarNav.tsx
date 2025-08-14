import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
    to: string;
    label: string;
    highlightColor: string;
}

export const SidebarLink = ({ to, label, highlightColor }: SidebarLinkProps) => {
    const location = useLocation();

    return (
        <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to={to}
                selected={location.pathname === to}
                sx={{
                    "&.Mui-selected": {
                        backgroundColor: highlightColor
                    },
                    "&:hover": {
                        backgroundColor: highlightColor
                    }
                }}
            >
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    );
};
