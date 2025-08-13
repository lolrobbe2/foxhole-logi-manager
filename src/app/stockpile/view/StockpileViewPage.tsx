import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CircularProgress, Typography, Box, Chip, Stack } from '@mui/material'
import { Stockpile } from '../../objects/Stockpile'

export const StockpileViewPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [stockpile, setStockpile] = useState<Stockpile | null>(null)
	const [loading, setLoading] = useState(true)

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
					bgcolor: '#121212'
				}}
			>
				<CircularProgress sx={{ color: '#f5f5f5' }} />
			</Box>
		)
	}

	if (stockpile == null) {
		return (
			<Box sx={{textAlign: 'center', bgcolor: '#121212' }}>
				<Typography variant="h5" sx={{ color: '#f5f5f5' }}>
					Stockpile not found
				</Typography>
			</Box>
		)
	}

	return (
		<Box sx={{ bgcolor: '#121212', minHeight: '100vh' }}>
			{/* Banner */}
			<Box
				sx={{
					p: '1.5rem',
					mb: '2rem',
					bgcolor: '#1f1f1f',
					borderRadius: '1rem',
					boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
					display: 'flex',
					flexDirection: 'column',
					gap: '0.75rem'
				}}
			>
				{/* Display Name as Title */}
				<Typography variant="h4" sx={{ color: '#f5f5f5' }}>
					{Stockpile.getDisplayName(stockpile)}
				</Typography>

				{/* Region & Subregion as Chips (inline) */}
				<Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
					<Chip label={Stockpile.getRegion(stockpile)} sx={{ bgcolor: '#1e88e5', color: '#fff', fontWeight: 'bold' }} />
					<Chip
						label={Stockpile.getSubregion(stockpile)}
						sx={{ bgcolor: '#43a047', color: '#fff', fontWeight: 'bold' }}
					/>
				</Box>
			</Box>
		</Box>
	)
}
