import { Box, Chip, CircularProgress, List, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CategoryItem, categoryItems } from '../../objects/categoryItems'
import { Stockpile, StockpileManager } from '../../objects/Stockpile'
import { CategoriesSelector, CategorySelectorItem } from './CategoriesSelector'
import { ItemTransaction } from './ItemTransaction'; // <- import ItemTransaction
import { CategoryItemsGrid } from './StockpileGrid'

const categories: CategorySelectorItem[] = [
	{ name: 'All', image: '/stockpile/categories/IconFilterAll.webp' },
	{ name: 'Small Arms', image: '/stockpile/categories/IconFilterSmallWeapons.webp' },
	{ name: 'Heavy Arms', image: '/stockpile/categories/IconFilterHeavyWeapons.webp' },
	{ name: 'Heavy Ammunition', image: '/stockpile/categories/IconFilterHeavyAmmunition.webp' },
	{ name: 'Utility', image: '/stockpile/categories/IconFilterUtility.webp' },
	{ name: 'Medical', image: '/stockpile/categories/IconFilterMedical.webp' },
	{ name: 'Resource', image: '/stockpile/categories/IconFilterResource.webp' },
	{ name: 'Uniforms', image: '/stockpile/categories/IconFilterUniforms.webp' },
	{ name: 'Vehicles', image: '/stockpile/categories/IconFilterVehicle.webp' },
	{ name: 'Vehicle Crates', image: '/stockpile/categories/IconFilterVehicleCrate.webp' },
	{ name: 'Shippable Structures', image: '/stockpile/categories/IconFilterShippables.webp' },
	{ name: 'Shippable Structure Crates', image: '/stockpile/categories/ShippableCrateIcon.webp' }
]

// Foxhole military-inspired color palette
const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#7a5c3c',
	highlight: '#4a5c4d',
	text: '#e0e0d1'
}

interface Transaction {
	itemName: string
	image: string
	quantity: number
	category: string
	inbound: boolean // true = inbound, false = outbound
}

export const StockpileViewPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [stockpile, setStockpile] = useState<Stockpile | null>(null)
	const [loading, setLoading] = useState(true)
	const [selectedCategory, setSelectedCategory] = useState<string>('All')
	const [transactions, setTransactions] = useState<Transaction[]>([])

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

	const handleItemClick = (item: CategoryItem, count: number | null) => {
		const transactionItem = {
			itemName: item.name,
			image: item.image,
			category: selectedCategory, // use currently selected category
			quantity: count ?? 1,
			inbound: true
		}

		setTransactions((prev) => {
			const index = prev.findIndex((t) => t.itemName === transactionItem.itemName)
			if (index >= 0) {
				const newTransactions = [...prev]
				newTransactions[index].quantity += transactionItem.quantity
				return newTransactions
			}
			return [...prev, transactionItem]
		})
	}

	const updateTransaction = (index: number, delta: number) => {
		setTransactions((prev) => {
			const newTransactions = [...prev]
			newTransactions[index].quantity += delta
			if (newTransactions[index].quantity <= 0) {
				newTransactions.splice(index, 1)
			}
			return newTransactions
		})
	}

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
		<Box sx={{ bgcolor: colors.background, minHeight: '100vh', display: 'flex' }}>
			{/* Main Content */}
			<Box sx={{ flex: 1, pr: '20rem' }}>
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
						itemTypes={categoryItems[selectedCategory] ?? []}
						stockpileItems={stockpile.items}
						onItemClick={handleItemClick} // <- pass click handler
					/>
				</Box>
			</Box>

			{/* Transaction Drawer */}
			<Box
				sx={{
					width: '20rem',
					position: 'fixed',
					right: 0,
					top: 0,
					height: '100%',
					bgcolor: colors.sidebar,
					p: '1rem',
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<Typography variant="h6" sx={{ color: colors.text, mb: '1rem' }}>
					Item Transactions
				</Typography>

				<List sx={{ flexGrow: 1 }}>
					{transactions.map((t, idx) => (
						<ItemTransaction
							key={idx}
							itemName={t.itemName}
							image={t.image}
							category={t.category}
							quantity={t.quantity}
							inbound={t.inbound}
							onChange={(delta) => updateTransaction(idx, delta)}
							onSetQuantity={(newQty) => {
								setTransactions((prev) => {
									const newTransactions = [...prev]
									newTransactions[idx].quantity = newQty
									if (newQty <= 0) newTransactions.splice(idx, 1)
									return newTransactions
								})
							}}
							onToggleInbound={() => {
								setTransactions((prev) => {
									const newTransactions = [...prev]
									newTransactions[idx] = { ...newTransactions[idx], inbound: !newTransactions[idx].inbound }
									return newTransactions
								})
							}}
						/>
					))}
				</List>

				{/* Complete Transaction Button */}
				<Box sx={{ mt: '1rem' }}>
					<button
						style={{
							width: '100%',
							padding: '0.75rem',
							backgroundColor: transactions.length > 0 ? '#4caf50' : '#555',
							color: '#fff',
							border: 'none',
							borderRadius: '0.5rem',
							fontWeight: 'bold',
							cursor: transactions.length > 0 ? 'pointer' : 'not-allowed'
						}}
						disabled={transactions.length === 0}
						onClick={async () => {
							try {
								if (!stockpile) return;

								for (const tx of transactions) {
									if (tx.inbound) {
										await StockpileManager.addItem(
											Stockpile.getRegion(stockpile),
											Stockpile.getSubregion(stockpile),
											Stockpile.getDisplayName(stockpile),
											tx.itemName,
											tx.quantity
										);
									} else {
										await StockpileManager.removeItem(
											Stockpile.getRegion(stockpile),
											Stockpile.getSubregion(stockpile),
											Stockpile.getDisplayName(stockpile),
											tx.itemName,
											tx.quantity
										);
									}
								}

								// Optionally: refresh stockpile data from server after commit
								const updated = await StockpileManager.getSingleStockpile(Stockpile.getRegion(stockpile),
									Stockpile.getSubregion(stockpile),
									Stockpile.getDisplayName(stockpile))
								setStockpile(updated);

								// Clear transactions after committing
								setTransactions([]);
							} catch (err) {
								console.error('Failed to complete transactions:', err);
								alert('One or more transactions failed to process.');
							}
						}}
					>
						Complete Transaction
					</button>
				</Box>
			</Box>

		</Box>
	)
}
