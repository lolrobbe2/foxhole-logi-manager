import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Button,
	Box
} from '@mui/material'
import { useState } from 'react'

interface WindDrawerProps {
	selectedWind: number | null // Level 0–3
	onSelectWind: (level: number) => void
	drawerWidth?: number
	offsetTop?: string // now a CSS unit string like "20rem"
}

const windLevels = [
	{ level: 1, label: 'Calm', windsock: '/wind/WindSockAnim1.gif', flag: '/wind/WindFlagAnim1.gif' },
	{ level: 2, label: 'Light Breeze', windsock: '/wind/WindSockAnim2.gif', flag: '/wind/WindFlagAnim2.gif' },
	{ level: 3, label: 'Strong Breeze', windsock: '/wind/WindSockAnim3.gif', flag: '/wind/WindFlagAnim3.gif' },
	{ level: 4, label: 'Gale', windsock: '/wind/WindSockAnim4.gif', flag: '/wind/WindFlagAnim4.gif' },
	{ level: 5, label: 'Storm', windsock: '/wind/WindSockAnim4.gif', flag: '/wind/WindFlagAnim5.gif' }
]

export const WindDrawer = ({
	selectedWind,
	onSelectWind,
	drawerWidth = 240,
	offsetTop = '28.5rem'
}: WindDrawerProps) => {
	const [showFlags, setShowFlags] = useState(true)

	return (
		<Drawer
			anchor="right"
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box',
					bgcolor: '#222',
					color: '#fff',
					top: offsetTop,
					height: `calc(100% - ${offsetTop})`,
					borderTop: '0.0625rem solid #444'
				}
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
				<Typography variant="h6">Wind</Typography>
				<Button
					variant="outlined"
					size="small"
					sx={{ color: '#fff', borderColor: '#555', '&:hover': { borderColor: '#aaa' } }}
					onClick={() => setShowFlags((prev) => !prev)}
				>
					{showFlags ? 'Show Windsock' : 'Show Flags'}
				</Button>
			</Box>

			<List>
				{windLevels.map((wind) => (
					<ListItem key={wind.level} disablePadding>
						<ListItemButton
							selected={selectedWind === wind.level}
							onClick={() => onSelectWind(wind.level)}
							sx={{
								'&.Mui-selected': {
									bgcolor: 'rgba(255,255,255,0.1)'
								}
							}}
						>
							<ListItemIcon sx={{ minWidth: '5.5rem' }}>
								<img
									src={showFlags ? wind.flag : wind.windsock}
									alt={wind.label}
									style={{ width: '5rem', height: '5rem' }}
								/>
							</ListItemIcon>
							<ListItemText primary={wind.label} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	)
}
