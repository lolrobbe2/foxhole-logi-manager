import {
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	CircularProgress,
	Box,
	Typography,
	TextField
} from '@mui/material'
import { useState } from 'react'

interface RegionDrawerProps {
	regions: string[]
	selectedRegion: string | null
	onSelectRegion: (region: string) => void
	loading: boolean
	drawerWidth?: number
}

const formatRegionName = (region: string): string => {
	let name = region.replace(/Hex$/i, '')
	name = name.replace(/([a-z])([A-Z])/g, '$1 $2')
	return name.trim()
}

export const RegionDrawer = ({
	regions,
	selectedRegion,
	onSelectRegion,
	loading,
	drawerWidth = 200
}: RegionDrawerProps) => {
	const [search, setSearch] = useState('')

	const filteredRegions = regions.filter((region) =>
		formatRegionName(region).toLowerCase().includes(search.toLowerCase())
	)

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box',
					marginLeft: '10vw',
					bgcolor: '#2a2a2a',
					color: '#f5f5f0',
					borderRight: '1px solid #444',
					display: 'flex',
					flexDirection: 'column'
				}
			}}
		>
			{/* Header + Search */}
			<Box
				sx={{
					bgcolor: '#2f2f2f',
					color: '#d4af78',
					p: '1rem',
					borderBottom: '1px solid #444'
				}}
			>
				<Typography variant="h6" noWrap sx={{ mb: '0.75rem' }}>
					Regions
				</Typography>
				<Divider
					sx={{
						borderColor: '#7a5c3c"',
						mb: '0.75rem',
						width: '100%',
						marginLeft: 0,
						marginRight: 0
					}}
				/>
				<TextField
					placeholder="Search..."
					size="small"
					fullWidth
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					sx={{
						input: { color: '#f5f5f0' },
						'& .MuiOutlinedInput-root': {
							'& fieldset': { borderColor: '#444' },
							'&:hover fieldset': { borderColor: '#666' },
							'&.Mui-focused fieldset': { borderColor: '#d4af78' }
						}
					}}
					InputProps={{
						sx: {
							fontSize: '0.9rem',
							bgcolor: '#1e1e1e',
							borderRadius: '0.5rem'
						}
					}}
				/>
			</Box>

			{/* Region list */}
			<Box sx={{ flex: 1, overflowY: 'auto' }}>
				{loading ? (
					<Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
						<CircularProgress size={24} sx={{ color: '#d4af78' }} />
					</Box>
				) : filteredRegions.length === 0 ? (
					<Typography sx={{ p: 2, color: '#aaa' }}>No regions found.</Typography>
				) : (
					<List disablePadding>
						{filteredRegions.map((region) => (
							<ListItem key={region} disablePadding>
								<ListItemButton
									selected={selectedRegion === region}
									onClick={() => onSelectRegion(region)}
									sx={{
										'&.Mui-selected': {
											bgcolor: '#3d3d3d',
											color: '#fff',
											'&:hover': { bgcolor: '#4a4a4a' }
										},
										'&:hover': { bgcolor: '#333' }
									}}
								>
									<ListItemText
										primary={formatRegionName(region)}
										slotProps={{
											primary: {
												fontWeight: 'bold'
											}
										}}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				)}
			</Box>
		</Drawer>
	)
}
