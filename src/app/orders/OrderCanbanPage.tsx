import React, { JSX, useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Chip, Grid, Stack, IconButton, Tooltip, Button } from '@mui/material'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

import { Order, OrderType, ProductionSubtype, TransportSubtype, OrderManager } from '../objects/Orders'
import OrderDetailsDialog from './OrdersDetailDialog'
import CreateOrder from './CreateOrder'
import DiscordService from '../discord'
import { useNavigate } from 'react-router-dom'

const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#d4af78',
	highlight: '#2f2f2f',
	text: '#f5f5f0'
}

// Subtype → icons
const subtypeIcons: Record<string, JSX.Element> = {
	[ProductionSubtype.MPF]: (
		<img
			src={'orders/MapIconMassProductionFactory.png'}
			alt="MPF"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	),
	[ProductionSubtype.Factory]: (
		<img src={'orders/MapIconFactory.webp'} alt="Factory" style={{ width: 40, height: 40, objectFit: 'contain' }} />
	),
	[ProductionSubtype.Facility]: (
		<img
			src={'orders/MaterialsFactoryIcon.webp'}
			alt="Facility"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	),
	[TransportSubtype.Hauler]: (
		<img
			src={'orders/R-1_Hauler_Vehicle_Icon.webp'}
			alt="Hauler"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	),
	[TransportSubtype.Flatbed]: (
		<img
			src={'orders/FlatbedTruckVehicleIcon.webp'}
			alt="Flatbed"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	),
	[TransportSubtype.Ship]: (
		<img src={'orders/Freighter02ItemIcon.webp'} alt="Ship" style={{ width: 40, height: 40, objectFit: 'contain' }} />
	),
	[TransportSubtype.Train]: (
		<img
			src={'orders/TrainEngineVehicleIcon.webp'}
			alt="Train"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	)
}

// Type → icons
const typeIcons: Record<string, JSX.Element> = {
	[OrderType.Production]: (
		<img
			src={'orders/MapIconManufacturing.webp'}
			alt="Transport"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	),
	[OrderType.Transport]: (
		<img
			src={'orders/R-1_Hauler_Vehicle_Icon.webp'}
			alt="Transport"
			style={{ width: 40, height: 40, objectFit: 'contain' }}
		/>
	)
}

const statusColumns = ['Created', 'Reserved', 'Completed'] as const

const OrderKanban: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [typeFilter, setTypeFilter] = useState<OrderType | 'All'>('All')
	const [subtypeFilter, setSubtypeFilter] = useState<string | 'All'>('All')
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [createOpen, setCreateOpen] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		async function checkPermissions() {
			const hasAccess = await DiscordService.allowed(['FH-VOID-Regiment', 'Stockpile Codes Approved'], false)
			if (!hasAccess) {
				navigate('/not-allowed')
			}
		}
		checkPermissions()
	}, [])

	useEffect(() => {
		OrderManager.getOrders().then(setOrders).catch(console.error)
	}, [])

	const filteredOrders = orders.filter((order) => {
		const typeMatch = typeFilter === 'All' || order.type === typeFilter
		const subtypeMatch = subtypeFilter === 'All' || order.subtype === subtypeFilter
		return typeMatch && subtypeMatch
	})

	const onDragEnd = async (result: DropResult) => {
		if (!result.destination) return

		const { draggableId, source, destination } = result
		const oldStatus = source.droppableId as 'Created' | 'Reserved' | 'Completed'
		const newStatus = destination.droppableId as 'Created' | 'Reserved' | 'Completed'

		// Prevent invalid moves
		const validMoves: Record<string, string[]> = {
			Created: ['Reserved'],
			Reserved: ['Completed'],
			Completed: [] // locked
		}

		if (!validMoves[oldStatus].includes(newStatus)) {
			return
		}

		try {
			if (newStatus === 'Reserved') {
				OrderManager.reserveOrder(draggableId, DiscordService.getFullUsername()!)
			} else if (newStatus === 'Completed') {
				OrderManager.completeOrder(draggableId)
			} else if (newStatus === 'Created') {
				OrderManager.unreserveOrder(draggableId, DiscordService.getFullUsername()!)
			}

			// Update UI after API success
			setOrders((prev) => prev.map((o) => (o.name === draggableId ? { ...o, status: newStatus } : o)))
		} catch (err) {
			console.error('Failed to update order:', err)
		}
	}
	const isEmpty = filteredOrders.filter((order) => order.status === status).length === 0

	return (
		<Box p={3} sx={{ backgroundColor: colors.background, minHeight: '100vh', color: colors.text }}>
			<Typography variant="h4" gutterBottom sx={{ color: colors.accent, fontWeight: 'bold' }}>
				📦 Order Kanban Board
			</Typography>

			{/* Create Order button */}
			<Button variant="contained" color="primary" onClick={() => setCreateOpen(true)} sx={{ mb: 2 }}>
				➕ Create Order
			</Button>

			{/* Filter: Types */}
			<Stack direction="row" spacing={2} sx={{ mb: 2 }}>
				<Tooltip title="All">
					<IconButton
						onClick={() => {
							setTypeFilter('All')
							setSubtypeFilter('All')
						}}
						sx={{ color: typeFilter === 'All' ? colors.accent : colors.text }}
					>
						📋
					</IconButton>
				</Tooltip>
				{Object.values(OrderType).map((type) => (
					<Tooltip key={type} title={type}>
						<IconButton
							onClick={() => {
								setTypeFilter(type)
								setSubtypeFilter('All')
							}}
							sx={{ color: typeFilter === type ? colors.accent : colors.text }}
						>
							{typeIcons[type]}
						</IconButton>
					</Tooltip>
				))}
			</Stack>

			{/* Filter: Subtypes */}
			<Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
				<Tooltip title="All">
					<IconButton
						onClick={() => setSubtypeFilter('All')}
						sx={{ color: subtypeFilter === 'All' ? colors.accent : colors.text }}
					>
						🌐
					</IconButton>
				</Tooltip>
				{typeFilter !== 'All' &&
					(typeFilter === OrderType.Production
						? Object.values(ProductionSubtype)
						: Object.values(TransportSubtype)
					).map((sub) => (
						<Tooltip key={sub} title={sub}>
							<IconButton
								onClick={() => setSubtypeFilter(sub)}
								sx={{ color: subtypeFilter === sub ? colors.accent : colors.text }}
							>
								{subtypeIcons[sub]}
							</IconButton>
						</Tooltip>
					))}
			</Stack>

			{/* DragDrop Kanban */}
			<DragDropContext onDragEnd={onDragEnd}>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<Grid container spacing={3} sx={{ maxWidth: '90vw' }}>
						{statusColumns.map((status) => (
							<Grid key={status} item xs sx={{ display: 'flex' }}>
								<Box
									sx={{
										flexGrow: 1,
										backgroundColor: isEmpty ? 'transparent' : colors.sidebar,
										border:
											status === 'Created'
												? '2px solid #8b0000'
												: status === 'Reserved'
													? '2px solid #f4a261'
													: status === 'Completed'
														? '2px solid #4caf50'
														: 'none',
										borderRadius: 2,
										p: 2,
										minHeight: '80vh',
										width: '25vw'
									}}
								>
									<Typography variant="h6" gutterBottom sx={{ color: colors.accent, textAlign: 'center' }}>
										{status}
									</Typography>

									<Droppable droppableId={status}>
										{(provided) => (
											<div ref={provided.innerRef} {...provided.droppableProps}>
												{filteredOrders
													.filter((order) => order.status === status)
													.map((order, index) => (
														<Draggable key={order.name} draggableId={order.name} index={index}>
															{(provided) => (
																<Card
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	onClick={() => setSelectedOrder(order)}
																	sx={{
																		mb: 2,
																		backgroundColor: colors.highlight,
																		borderRadius: 2,
																		boxShadow: 3,
																		cursor: 'pointer'
																	}}
																>
																	<CardContent>
																		<Stack direction="row" alignItems="center" spacing={1}>
																			{subtypeIcons[order.subtype]}
																			<Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.text }}>
																				{order.name}
																			</Typography>
																		</Stack>

																		<Box sx={{ mt: 1 }}>
																			<Chip
																				label={order.type}
																				size="small"
																				sx={{
																					mr: 1,
																					backgroundColor: colors.accent,
																					color: colors.background,
																					fontWeight: 'bold'
																				}}
																			/>
																			<Chip
																				label={order.subtype}
																				size="small"
																				icon={subtypeIcons[order.subtype]}
																				sx={{ backgroundColor: colors.accent, color: colors.background }}
																			/>
																		</Box>

																		<Typography variant="caption" sx={{ color: colors.text, display: 'block', mt: 1 }}>
																			{order.type === OrderType.Production
																				? `To: ${order.destination.split('_')[0]}`
																				: `From: ${order.source.split('_')[0]} → ${order.destination.split('_')[0]}`}
																		</Typography>
																	</CardContent>
																</Card>
															)}
														</Draggable>
													))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			</DragDropContext>

			{/* Popup for details */}
			<OrderDetailsDialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />

			{/* Popup for creating orders */}
			<CreateOrder
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				defaultType={typeFilter}
				defaultSubtype={subtypeFilter}
				onCreated={() => OrderManager.getOrders().then(setOrders)}
			/>
		</Box>
	)
}

export default OrderKanban
