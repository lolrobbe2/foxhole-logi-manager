import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDiscordSdk } from "../hooks/useDiscordSdk";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { SidebarLink } from "./SidebarNav";
import { ArtilleryPage } from "./arty/ArtilleryPage";
import { GPS } from "./gps/gps";
import { StockpilesPage } from "./stockpile/StockpilePage";
import { StockpileViewPage } from "./stockpile/view/StockpileViewPage";

const drawerWidth = "10vw";

const colors = {
	background: "#1b1b1b",
	sidebar: "#2a2a2a",
	accent: "#7a5c3c",
	highlight: "#4a5c4d",
	text: "#e0e0d1"
};

const Orders = () => (
	<Typography variant="body1" sx={{ color: colors.text }}>
		Showing Orders content here...
	</Typography>
);

const Sidebar = () => (
	<Drawer
		variant="permanent"
		sx={{
			width: drawerWidth,
			flexShrink: 0,
			[`& .MuiDrawer-paper`]: {
				width: drawerWidth,
				boxSizing: "border-box",
				backgroundColor: colors.sidebar,
				color: colors.text
			}
		}}
	>
		<Toolbar>
			<Typography variant="h6" noWrap sx={{ color: colors.accent }}>
				Menu
			</Typography>
		</Toolbar>
		<Divider sx={{ backgroundColor: colors.accent }} />
		<List>
			<SidebarLink to="/stockpiles" label="Stockpiles" highlightColor={colors.highlight} />
			<SidebarLink to="/orders" label="Orders" highlightColor={colors.highlight} />
			<SidebarLink to="/artillery" label="Artillery" highlightColor={colors.highlight} />
		</List>
	</Drawer>
);

export const Activity = () => {
	const { authenticated, discordSdk } = useDiscordSdk();
	const [channelName, setChannelName] = useState<string>();
	const location = useLocation();

	useEffect(() => {
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return;
		}

		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name);
			}
		});
	}, [authenticated, discordSdk]);

	const isGpsPage = location.pathname === "/gps" || location.pathname === "/artillery";

	return (
		<Box sx={{ display: "flex", height: "100vh", backgroundColor: colors.background }}>
			<CssBaseline />
			<Sidebar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					bgcolor: colors.background,
					p: isGpsPage ? 0 : 3,
					mt: isGpsPage ? 0 : 8
				}}
			>
				<Routes>
					<Route path="/stockpiles" element={<StockpilesPage />} />
					<Route path="/stockpiles/view" element={<StockpileViewPage />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/artillery" element={<ArtilleryPage />} />
					<Route path="*" element={<StockpilesPage />} />
				</Routes>
			</Box>
		</Box>
	);
};
