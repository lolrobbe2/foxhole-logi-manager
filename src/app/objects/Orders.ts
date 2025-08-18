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

export class OrderManager {
    public static async createOrder(order: Omit<Order, 'status' | 'takenBy'> & { createdBy: string }): Promise<void> {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to create order: ${errorText}`)
        }
    }

    public static async reserveItem(orderName: string, itemName: string, count: number, username: string): Promise<void> {
        // TODO: implement
    }

    public static async completeOrder(orderName: string): Promise<void> {
        // TODO: implement
    }
}
