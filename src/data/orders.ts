import FirestoreCollection from './collection'
import FirestoreDocument from './FirestoreDocument'
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

// --- Updated OrderManager methods ---
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

  public static async reserveItem(orderName: string, itemName: string, count: number, username: string): Promise<void> {
    const docRef = this.orderCollection.doc(orderName)
    const order = await docRef.get()

    if (!order) {
      throw new Error(`Order "${orderName}" not found.`)
    }

    const updatedItems = [...order.items]
    const existingIndex = updatedItems.findIndex((i) => i.name === itemName)

    if (existingIndex >= 0) {
      updatedItems[existingIndex].count += count
    } else {
      updatedItems.push({ name: itemName, count })
    }

    await docRef.set({ ...order, items: updatedItems, status: 'Reserved', takenBy: username })
  }

  public static async completeOrder(orderName: string): Promise<void> {
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
  }
}
