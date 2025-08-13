import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CircularProgress, Typography, Box, Chip } from '@mui/material'
import { Stockpile } from '../../objects/Stockpile'
import { CategoriesSelector, CategorySelectorItem } from './CategoriesSelector'
import { CategoryItemsGrid } from './StockpileGrid' // <- new import
import { categoryItems } from '../../objects/categoryItems'

const categories: CategorySelectorItem[] = [
	{ name: 'All', image: '../../../../public/stockpile/categories/IconFilterAll.webp' },
	{ name: 'Small Arms', image: '../../../../public/stockpile/categories/IconFilterSmallWeapons.webp' },
	{ name: 'Heavy Arms', image: '../../../../public/stockpile/categories/IconFilterHeavyWeapons.webp' },
	{ name: 'Heavy Ammunition', image: '../../../../public/stockpile/categories/IconFilterHeavyAmmunition.webp' },
	{ name: 'Utility', image: '../../../../public/stockpile/categories/IconFilterUtility.webp' },
	{ name: 'Medical', image: '../../../../public/stockpile/categories/IconFilterMedical.webp' },
	{ name: 'Resource', image: '../../../../public/stockpile/categories/IconFilterResource.webp' },
	{ name: 'Uniforms', image: '../../../../public/stockpile/categories/IconFilterUniforms.webp' },
	{ name: 'Vehicles', image: '../../../../public/stockpile/categories/IconFilterVehicle.webp' },
	{ name: 'Vehicle Crates', image: '../../../../public/stockpile/categories/IconFilterVehicleCrate.webp' },
	{ name: 'Shippable Structures', image: '../../../../public/stockpile/categories/IconFilterShippables.webp' },
	{ name: 'Shippable Structure Crates', image: '../../../../public/stockpile/categories/ShippableCrateIcon.webp' }
]

// Foxhole military-inspired color palette
const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#7a5c3c',
	highlight: '#4a5c4d',
	text: '#e0e0d1'
}

export const StockpileViewPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [stockpile, setStockpile] = useState<Stockpile | null>(null)
	const [loading, setLoading] = useState(true)
	const [selectedCategory, setSelectedCategory] = useState<string>('All')

	useEffect(() => {
		if (!location.state?.stockpile) {
			setStockpile(null)
			setLoading(false)
			navigate('/stockpiles', { replace: true })
			return
		}
		setStockpile(location.state.stockpile as Stockpile)
		setLoading(false)
	}, [location.state, navigate])

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					bgcolor: colors.background
				}}
			>
				<CircularProgress sx={{ color: colors.text }} />
			</Box>
		)
	}

	if (stockpile == null) {
		return (
			<Box sx={{ textAlign: 'center', bgcolor: colors.background }}>
				<Typography variant="h5" sx={{ color: colors.text }}>
					Stockpile not found
				</Typography>
			</Box>
		)
	}

	return (
		<Box sx={{ bgcolor: colors.background, minHeight: '100vh' }}>
			{/* Banner */}
			<Box
				sx={{
					ml: '1.5rem',
					mr: '1.5rem',
					mb: '2rem',
					bgcolor: colors.sidebar,
					borderRadius: '1rem',
					boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					textAlign: 'center',
					minHeight: '4rem'
				}}
			>
				{/* Region & Subregion Chips */}
				<Box
					sx={{
						position: 'absolute',
						left: '1.5rem',
						display: 'flex',
						gap: '0.5rem',
						flexWrap: 'wrap'
					}}
				>
					<Chip
						label={Stockpile.getRegion(stockpile)}
						sx={{
							bgcolor: colors.accent,
							color: colors.text,
							fontWeight: 'bold'
						}}
					/>
					<Chip
						label={Stockpile.getSubregion(stockpile)}
						sx={{
							bgcolor: colors.highlight,
							color: colors.text,
							fontWeight: 'bold'
						}}
					/>
				</Box>

				{/* Title */}
				<Typography variant="h4" sx={{ color: colors.text }}>
					{Stockpile.getDisplayName(stockpile)}
				</Typography>
			</Box>

			{/* Categories */}
			<CategoriesSelector
				selectedCategory={selectedCategory}
				categories={categories}
				onCategoryClick={(cat) => setSelectedCategory(cat.name)}
			/>

			{/* Items Grid */}
			<Box sx={{ mt: '2rem', px: '1.5rem' }}>
				<CategoryItemsGrid
					category={selectedCategory}
					itemTypes={categoryItems[selectedCategory] ?? []} // now full objects
					stockpileItems={stockpile.items}
				/>
			</Box>
		</Box>
	)
}
