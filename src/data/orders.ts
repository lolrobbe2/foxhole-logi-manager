import FirestoreCollection from './collection'
import { StockpileManager } from './stockpile'

// Main order types
export enum OrderType {
	Production = 'Production',
	Transport = 'Transport'
}

// Subtypes for Production orders
export enum ProductionSubtype {
	MPF = 'MPF',
	Factory = 'Factory',
	Facility = 'Facility'
}

// Subtypes for Transport orders
export enum TransportSubtype {
	Hauler = 'Hauler',
	Flatbed = 'Flatbed',
	Ship = 'Ship',
	Train = 'Train'
}

export interface OrderItem {
	name: string
	count: number
}
// --- Updated Order type ---
export type Order =
	| {
			name: string
			type: OrderType.Production
			subtype: ProductionSubtype
			destination: string // combined stockpile name: region_subregion_name
			items: OrderItem[]
			status: 'Created' | 'Reserved' | 'Completed'
			createdBy: string // username or Discord tag
			takenBy?: string // optional: who reserved/took the order
	  }
	| {
			name: string
			type: OrderType.Transport
			subtype: TransportSubtype
			source: string // combined stockpile name: region_subregion_name
			destination: string
			items: OrderItem[]
			status: 'Created' | 'Reserved' | 'Completed'
			createdBy: string
			takenBy?: string
	  }

/**
 * this class handles all the created orders and order management.
 * Such as reserving an order for a player and completing an order for a player.
 */
export class OrderManager {
	private static orderCollection = new FirestoreCollection<Order>('orders')

	public static async createOrder(order: Omit<Order, 'status' | 'takenBy'> & { createdBy: string }): Promise<void> {
		const docRef = this.orderCollection.doc(order.name)

		const existing = await docRef.get()
		if (existing) {
			throw new Error(`Order "${order.name}" already exists.`)
		}

		const newOrder: Order = {
			...order,
			items: order.items ?? [],
			status: 'Created'
		}

		await docRef.set(newOrder)
	}

	/**
	 * this function reserves an order for a user.
	 * @param orderName the name of the order to be reserved
	 * @param username the username of the person reserving the order.
	 */
	public static async reserveOrder(orderName: string, username: string): Promise<Order | null> {
		const docRef = this.orderCollection.doc(orderName)
		const order = await docRef.get()

		if (!order) {
			throw new Error(`Order "${orderName}" not found.`)
		}
		if (order.status !== 'Created') {
			return null
		}

		const updatedItems = [...order.items]
		await docRef.set({ ...order, items: updatedItems, status: 'Reserved', takenBy: username })
    return order;
	}

	/**
	 * This function unreserve's an order, resetting its status to 'Created'.
	 * @param orderName the name of the order to be unreserved
	 */
	public static async unreserveOrder(orderName: string): Promise<void> {
		const docRef = this.orderCollection.doc(orderName)
		const order = await docRef.get()

		if (!order) {
			throw new Error(`Order "${orderName}" not found.`)
		}

		// Only unreserve if it's currently reserved
		if (order.status !== 'Reserved') {
			return
		}

		const updatedItems = [...order.items]
		await docRef.set({ ...order, items: updatedItems, status: 'Created', takenBy: undefined })
	}

	/**
	 * this function marks an order as completed
	 * @param orderName the name of the order to complete
	 */
	public static async completeOrder(orderName: string): Promise<Order> {
		const docRef = this.orderCollection.doc(orderName)
		const order = await docRef.get()

		if (!order) {
			throw new Error(`Order "${orderName}" not found.`)
		}

		if (order.status === 'Completed') {
			throw new Error(`Order "${orderName}" is already completed.`)
		}

		if (order.type === OrderType.Production) {
			const [region, subregion, stockpileName] = order.destination.split('_')
			for (const item of order.items) {
				await StockpileManager.addItem(region, subregion, stockpileName, item.name, item.count)
			}
		} else if (order.type === OrderType.Transport) {
			const [sourceRegion, sourceSubregion, sourceStockpile] = order.source.split('_')
			const [destRegion, destSubregion, destStockpile] = order.destination.split('_')

			for (const item of order.items) {
				await StockpileManager.removeItem(sourceRegion, sourceSubregion, sourceStockpile, item.name, item.count)
				await StockpileManager.addItem(destRegion, destSubregion, destStockpile, item.name, item.count)
			}
		}

		await docRef.set({ ...order, status: 'Completed' })
    return order;
	}

	public static async getOrders(): Promise<Order[]> {
		const docRefs = await this.orderCollection.getDocs()
		const orders: Order[] = []

		for (const doc of docRefs) {
			const data = await doc.get()
			if (data) {
				orders.push(data)
			}
		}

		return orders
	}

	public static async getReservedOrdersByName(name: string): Promise<Order[]> {
		const docRefs = await this.orderCollection.getDocs()
		const reservedOrders: Order[] = []

		for (const doc of docRefs) {
			const data = await doc.get()
			if (data && data.status === 'Reserved' && data.name === name) {
				reservedOrders.push(data)
			}
		}

		return reservedOrders
	}
}
