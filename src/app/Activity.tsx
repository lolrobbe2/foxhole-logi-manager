import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import { StockpilesPage } from './stockpile/StockpilePage'
import { StockpileViewPage } from './stockpile/view/StockpileViewPage'

const drawerWidth = '10vw'

// Foxhole military-inspired color palette
const colors = {
	background: '#1b1b1b', // deep dark steel
	sidebar: '#2a2a2a', // slightly lighter for sidebar
	accent: '#7a5c3c', // muted brown/bronze
	highlight: '#4a5c4d', // olive-gray for hover/selected
	text: '#e0e0d1' // off-white
}

const Orders = () => (
	<Typography variant="body1" sx={{ color: colors.text }}>
		Showing Orders content here...
	</Typography>
)

const Sidebar = () => {
	const location = useLocation()

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box',
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
				<ListItem disablePadding>
					<ListItemButton
						component={Link}
						to="/stockpiles"
						selected={location.pathname === '/stockpiles'}
						sx={{
							'&.Mui-selected': {
								backgroundColor: colors.highlight
							},
							'&:hover': {
								backgroundColor: colors.highlight
							}
						}}
					>
						<ListItemText primary="Stockpiles" />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton
						component={Link}
						to="/orders"
						selected={location.pathname === '/orders'}
						sx={{
							'&.Mui-selected': {
								backgroundColor: colors.highlight
							},
							'&:hover': {
								backgroundColor: colors.highlight
							}
						}}
					>
						<ListItemText primary="Orders" />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	)
}

export const Activity = () => {
	const { authenticated, discordSdk } = useDiscordSdk()
	const [channelName, setChannelName] = useState<string>()

	useEffect(() => {
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})
	}, [authenticated, discordSdk])

	return (
		<BrowserRouter>
			<Box sx={{ display: 'flex', height: '100vh', backgroundColor: colors.background }}>
				<CssBaseline />

				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						bgcolor: colors.background,
						p: 3,
						mt: 8
					}}
				>
					<Routes>
						<Route path="/stockpiles" element={<StockpilesPage />} />
						<Route path="/stockpiles/view" element={<StockpileViewPage />} />
						<Route path="/orders" element={<Orders />} />
						<Route path="*" element={<StockpilesPage />} />
					</Routes>
				</Box>
			</Box>
		</BrowserRouter>
	)
}
