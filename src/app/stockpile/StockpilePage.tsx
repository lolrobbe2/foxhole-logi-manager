import { useEffect, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Stockpile, StockpileManager } from '../../app/objects/Stockpile'
import { RegionDrawer } from '../RegionSidebar'
import { StockpileList } from './StockpileList'
import { CreateStockpileDialog } from './StockpileCreateDialog'
import DiscordService from '../discord'
import { useNavigate } from 'react-router-dom'

export const StockpilesPage = () => {
	const [regions, setRegions] = useState<string[]>([])
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
	const [stockpiles, setStockpiles] = useState<Stockpile[]>([])
	const [loadingRegions, setLoadingRegions] = useState<boolean>(true)
	const [loadingStockpiles, setLoadingStockpiles] = useState<boolean>(false)
	const [openDialog, setOpenDialog] = useState<boolean>(false)
	const navigate = useNavigate()

	useEffect(() => {
		async function checkPermissions() {
			const hasAccess = await DiscordService.allowed(['FH-VOID-Regiment','Stockpile Codes Approved'], false)
			if (!hasAccess) {
				navigate('/not-allowed')
			}
		}
		checkPermissions()
	}, [])

	// Load regions
	useEffect(() => {
		async function loadRegions() {
			setLoadingRegions(true)
			const allRegions: string[] = await StockpileManager.getAllRegions()
			setRegions(allRegions)
			setLoadingRegions(false)
			if (allRegions.length > 0) setSelectedRegion(allRegions[0])
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
			const regionStockpiles = await StockpileManager.getStockpilesByRegion(selectedRegion)
			setStockpiles(regionStockpiles)
			setLoadingStockpiles(false)
		}
		loadStockpiles()
	}, [selectedRegion])

	const handleCreateStockpile = (name: string, code: string) => {
		setOpenDialog(false)
	}

	return (
		<Box sx={{ display: 'flex', height: '100%', bgcolor: '#1b1b1b', color: '#f5f5f0' }}>
			<RegionDrawer
				regions={regions}
				selectedRegion={selectedRegion}
				onSelectRegion={setSelectedRegion}
				loading={loadingRegions}
			/>

			<Box sx={{ flexGrow: 1, position: 'relative' }}>
				{/* Add Button */}
				<IconButton
					onClick={() => setOpenDialog(true)}
					sx={{
						position: 'absolute',
						top: '1rem',
						right: '1rem',
						bgcolor: '#d4af78',
						color: '#1b1b1b',
						'&:hover': { bgcolor: '#b89050' }
					}}
				>
					<AddIcon />
				</IconButton>

				<StockpileList stockpiles={stockpiles} loading={loadingStockpiles} region={selectedRegion} />

				<CreateStockpileDialog
					open={openDialog}
					region={selectedRegion}
					onClose={() => setOpenDialog(false)}
					onCreate={handleCreateStockpile}
				/>
			</Box>
		</Box>
	)
}
