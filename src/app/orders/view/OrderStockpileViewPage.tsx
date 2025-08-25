import { Box, Chip, CircularProgress, List, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CategoryItem, categoryItems } from '../../objects/categoryItems'
import { Stockpile } from '../../objects/Stockpile'
import { CategoriesSelector, CategorySelectorItem } from '../../stockpile/view/CategoriesSelector'
import { CategoryItemsGrid } from '../../stockpile/view/StockpileGrid'
import { OrderTransaction } from './OrderTransactionItem'
import { Order, OrderItem, OrderManager } from '../../objects/Orders'
import DiscordService from '../../discord'

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

export const OrderStockpileViewPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [newOrder, setNewOrder] = useState<Order | null>(null)
	const [stockpile, setStockpile] = useState<Stockpile | null>(null)
	const [loading, setLoading] = useState(true)
	const [selectedCategory, setSelectedCategory] = useState<string>('All')
	const [transactions, setTransactions] = useState<Transaction[]>([])

	useEffect(() => {
		const order = location.state?.newOrder as any | undefined
		if (!order || order === undefined) {
			setStockpile(null)
			setLoading(false)
			navigate('/orders', { replace: true })
			return
		}

		setNewOrder(order as Order)
		setStockpile(order.destinationStockpile)

		const items = categoryItems[selectedCategory] ?? []
		const imagePromises = items.map((item) => {
			return new Promise<void>((resolve) => {
				const img = new Image()
				img.src = item.image
				img.onload = () => resolve()
				img.onerror = () => resolve()
			})
		})

		Promise.all([...imagePromises]).then(() => {
			setLoading(false)
		})
	}, [navigate, location.state, selectedCategory])

	const handleItemClick = (item: CategoryItem) => {
		setTransactions((prev) => {
			const existing = prev.find((t) => t.itemName === item.name)
			if (existing) {
				return prev.map((t) => (t.itemName === item.name ? { ...t, quantity: t.quantity + 1 } : t))
			}
			return [
				...prev,
				{
					itemName: item.name,
					image: item.image,
					category: item.category,
					quantity: 1,
					inbound: true
				}
			]
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
			<Box sx={{ flex: 1 }}>
				{/* Banner */}
				{/* ... same as before ... */}

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
						onItemClick={handleItemClick}
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
					Order Items
				</Typography>

				<List sx={{ flexGrow: 1 }}>
					{transactions.map((t, idx) => (
						<OrderTransaction
							key={idx}
							itemName={t.itemName}
							image={t.image}
							category={t.category}
							quantity={t.quantity}
							forceInbound={true}
							onChange={(delta) => {
								setTransactions((prev) => {
									const updated = [...prev]
									updated[idx].quantity += delta
									if (updated[idx].quantity <= 0) updated.splice(idx, 1)
									return updated
								})
							}}
							onSetQuantity={(newQty: number) => {
								setTransactions((prev) => {
									const updated = [...prev]
									updated[idx].quantity = newQty
									if (newQty <= 0) updated.splice(idx, 1)
									return updated
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
							const orderItems: OrderItem[] = transactions.map((t) => ({
								name: t.itemName,
								count: t.quantity
							}))

							const orderToSend: Order = {
								...newOrder!,
								createdBy: DiscordService.getFullUsername(),
								items: orderItems // assuming your Order type expects this
							}

							await OrderManager.createOrder(orderToSend)
							navigate("/orders");
						}}
					>
						Create Order
					</button>
				</Box>
			</Box>
		</Box>
	)
}
