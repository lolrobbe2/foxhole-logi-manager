import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDiscordSdk } from '../hooks/useDiscordSdk'

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { SidebarLink } from './SidebarNav'
import { ArtilleryPage } from './arty/ArtilleryPage'
import { GPS } from './gps/gps'
import { StockpilesPage } from './stockpile/StockpilePage'
import { StockpileViewPage } from './stockpile/view/StockpileViewPage'
import { SourceSelectionPage } from './orders/selection/SourceSelectionPage'
import { DestinationSelectionPage } from './orders/selection/DestinationSelectionPage'
import OrderKanban from './orders/OrderCanbanPage'
import { OrderStockpileViewPage } from './orders/view/OrderStockpileViewPage'
import NotFound from './default/NotFound'
import NotAllowed from './default/NotAllowed'
import HomePage from './default/HomePage'
import DiscordService from './discord'
import { LogiSheet } from './tools/LogiSheet'
import { CircularProgress } from '@mui/material'
import RoleSelection from './roles/RoleSelection'

const drawerWidth = '10vw'

const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#7a5c3c',
	highlight: '#4a5c4d',
	text: '#e0e0d1'
}

const Orders = () => (
	<Typography variant="body1" sx={{ color: colors.text }}>
		Showing Orders content here...
	</Typography>
)

const Sidebar = () => {
	const [showStockpiles, setShowStockpiles] = useState(false)
	useEffect(() => {
		async function checkAccess() {
			setShowStockpiles(await DiscordService.allowed(['FH-VOID-Regiment', 'Stockpile Codes Approved'], true))
		}
		checkAccess()
	}, [])
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
				{showStockpiles && (
					<SidebarLink to="/stockpiles" label="Stockpiles" highlightColor={colors.highlight} />
				)}
				{showStockpiles && <SidebarLink to="/orders" label="Orders" highlightColor={colors.highlight} />}
				{<SidebarLink to="/artillery" label="Artillery" highlightColor={colors.highlight} />}
				{<SidebarLink to="/logi-sheet" label="logi sheet" highlightColor={colors.highlight} />}
				{<SidebarLink to="/roles-selection" label="roles" highlightColor={colors.highlight} />}
			</List>
		</Drawer>
	)
}

export const Activity = () => {
	const { authenticated, discordSdk, status } = useDiscordSdk()
	const [channelName, setChannelName] = useState<string>()
	const location = useLocation()
	const [allowed, setAllowed] = useState(false)

	useEffect(() => {
		async function checkAccess() {
			setAllowed(await DiscordService.allowed(['FH-VOID-Regiment'], false))
		}
		checkAccess()
	}, [])

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

	const MarginRoutes = ['/gps', '/artillery', '/logi-sheet', '/']
	const isMarginPage = MarginRoutes.includes(location.pathname)
	if (status === 'authenticating') {
		return (
			<Box
				sx={{
					height: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: colors.background
				}}
			>
				<CircularProgress color="primary" />
			</Box>
		)
	} else {
		return (
			<Box sx={{ display: 'flex', height: '100vh', backgroundColor: colors.background }}>
				<CssBaseline />
				{allowed && <Sidebar />}
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						bgcolor: colors.background,
						p: isMarginPage ? 0 : 3,
						mt: isMarginPage ? 0 : 8
					}}
				>
					<Routes>
						<Route path="/stockpiles" element={<StockpilesPage />} />
						<Route path="/stockpiles/view" element={<StockpileViewPage />} />
						<Route path="/orders" element={<OrderKanban />} />
						{/* Source / Destination selection pages */}
						<Route path="/orders/select-source" element={<SourceSelectionPage />} />
						<Route path="/orders/select-destination" element={<DestinationSelectionPage />} />
						<Route path="/orders/select-items" element={<OrderStockpileViewPage />} />
						<Route path="/artillery" element={<ArtilleryPage />} />
						<Route path="/" element={<HomePage />} />
						<Route path="/not-allowed" element={<NotAllowed />} />
						<Route path="/logi-sheet" element={<LogiSheet />} />
						<Route path="/roles-selection" element={<RoleSelection />}/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Box>
			</Box>
		)
	}
}
