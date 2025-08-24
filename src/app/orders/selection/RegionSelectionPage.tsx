import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Stockpile, StockpileManager } from '../../objects/Stockpile'
import { RegionDrawer } from '../../RegionSidebar'
import { OrderStockpileList } from './OrderStockpileList'

interface SelectionPageProps {
	onSelect: (stockpile: Stockpile) => void // called when user selects a stockpile
	title: string // e.g., "Select Source" or "Select Destination"
}

export const SelectionPage: React.FC<SelectionPageProps> = ({ onSelect, title }) => {
	const [regions, setRegions] = useState<string[]>([])
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
	const [stockpiles, setStockpiles] = useState<Stockpile[]>([])
	const [loadingRegions, setLoadingRegions] = useState<boolean>(true)
	const [loadingStockpiles, setLoadingStockpiles] = useState<boolean>(false)

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
			console.log(selectedRegion)

			const regionStockpiles = await StockpileManager.getStockpilesByRegion(selectedRegion)

			setStockpiles(regionStockpiles)
			setLoadingStockpiles(false)
		}
		loadStockpiles()
	}, [selectedRegion])

	return (
		<Box sx={{ display: 'flex', height: '100%', bgcolor: '#1b1b1b', color: '#f5f5f0' }}>
			<RegionDrawer
				regions={regions}
				selectedRegion={selectedRegion}
				onSelectRegion={setSelectedRegion}
				loading={loadingRegions}
			/>
			<Box sx={{ flexGrow: 1, position: 'relative', p: 2 }}>
				<Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
					{title}
				</Typography>

				<OrderStockpileList
					stockpiles={stockpiles}
					loading={loadingStockpiles}
					region={selectedRegion}
					onSelect={onSelect}
				/>
			</Box>
		</Box>
	)
}
