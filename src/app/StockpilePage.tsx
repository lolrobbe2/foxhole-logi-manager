import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import { StockpileManager } from '../api/objects/stockpile'
import { Toolbar } from '@mui/material'

interface RegionTabProps {
	label: string
	value: string
}

const drawerWidth = 240

export const StockpilesPage = () => {
	const [regions, setRegions] = useState<string[]>([])
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
	const [stockpiles, setStockpiles] = useState<Stockpile[]>([])
	const [loadingRegions, setLoadingRegions] = useState<boolean>(true)
	const [loadingStockpiles, setLoadingStockpiles] = useState<boolean>(false)

	// Load all regions on mount
	useEffect(() => {
		async function loadRegions() {
			setLoadingRegions(true)
			const allRegions = await StockpileManager.getAllRegions()
			setRegions(allRegions)
			setLoadingRegions(false)
			if (allRegions.length > 0) {
				setSelectedRegion(allRegions[0])
			}
		}
		loadRegions()
	}, [])

	// Load stockpiles for selected region
	useEffect(() => {
		if (!selectedRegion) {
			setStockpiles([])
			return
		}

		async function loadStockpiles() {
			setLoadingStockpiles(true)
			const regionStockpiles = await StockpileManager.getStockpilesByRegion(selectedRegion ?? '')
			setStockpiles(regionStockpiles)
			setLoadingStockpiles(false)
		}
		loadStockpiles()
	}, [selectedRegion])

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{/* Sidebar */}
			<Box
				sx={{
					width: '20%',
					bgcolor: 'background.paper',
					borderRight: 1,
					borderColor: 'divider',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				{/* Top-level toolbar for region header */}
				<Toolbar>
					<Typography variant="h6" noWrap>
						Regions
					</Typography>
				</Toolbar>

				{/* Region tabs or list */}
				<Tabs
					orientation="vertical"
					variant="scrollable"
					value={selectedRegion}
					onChange={(event, newValue) => setSelectedRegion(newValue)}
					sx={{ flexGrow: 1 }}
				>
					{regions.map((region) => (
						<Tab key={region} label={region} value={region} />
					))}
				</Tabs>
			</Box>
		</Box>
	)
}
