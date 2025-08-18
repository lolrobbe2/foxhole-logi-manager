import FirestoreCollection from "./collection"
import FirestoreDocument from "./FirestoreDocument"
import { StockpileManager } from "./stockpile"

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

// Discriminated union for type-safe orders
export type Order =
  | {
      name: string
      type: OrderType.Production
      subtype: ProductionSubtype
      destination: string // combined stockpile name: region_subregion_name
      items: OrderItem[]
      status: 'Created' | 'Reserved' | 'Completed'
    }
  | {
      name: string
      type: OrderType.Transport
      subtype: TransportSubtype
      source: string // combined stockpile name: region_subregion_name
      destination: string
      items: OrderItem[]
      status: 'Created' | 'Reserved' | 'Completed'
    }

export class OrderManager {
  private static orderCollection = new FirestoreCollection<Order>('orders')

  // --- Create order ---
  public static async createOrder(order: Omit<Order, 'status'>): Promise<void> {
    const docRef = this.orderCollection.doc(order.name)

    const existing = await docRef.get()
    if (existing) {
      throw new Error(`Order "${order.name}" already exists.`)
    }

    const newOrder: Order = {
      ...order,
      status: 'Created'
    }

    await docRef.set(newOrder)
  }

  // --- Reserve item(s) for an order ---
  public static async reserveItem(orderName: string, itemName: string, count: number): Promise<void> {
    const docRef = this.orderCollection.doc(orderName)
    const order = await docRef.get()

    if (!order) {
      throw new Error(`Order "${orderName}" not found.`)
    }

    const updatedItems = [...order.items]
    const existingIndex = updatedItems.findIndex(i => i.name === itemName)

    if (existingIndex >= 0) {
      updatedItems[existingIndex].count += count
    } else {
      updatedItems.push({ name: itemName, count })
    }

    await docRef.set({ ...order, items: updatedItems, status: 'Reserved' })
  }

  // --- Complete order (apply items to destination stockpile) ---
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
        // Remove from source
        await StockpileManager.removeItem(sourceRegion, sourceSubregion, sourceStockpile, item.name, item.count)
        // Add to destination
        await StockpileManager.addItem(destRegion, destSubregion, destStockpile, item.name, item.count)
      }
    }

    await docRef.set({ ...order, status: 'Completed' })
  }

  // --- Utility methods ---
  public static async getOrder(name: string): Promise<Order | null> {
    const docRef = this.orderCollection.doc(name)
    return (await docRef.get()) ?? null
  }

  public static async getOrders(): Promise<Order[]> {
    const docs: FirestoreDocument<Order>[] = await this.orderCollection.getDocs()
    const orders: Order[] = []

    for (const doc of docs) {
      const data = await doc.get()
      if (data) orders.push(data)
    }

    return orders
  }

  public static async removeOrder(name: string): Promise<void> {
    const docRef = this.orderCollection.doc(name)
    await docRef.delete()
  }

  public static async removeAllOrders(): Promise<void> {
    const docs: FirestoreDocument<Order>[] = await this.orderCollection.getDocs()
    for (const doc of docs) {
      await doc.delete()
    }
  }
}
