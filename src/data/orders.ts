// Main order types
export enum OrderType {
	Production = 'Production',
	Transport = 'Transport'
}

// Subtypes for Production orders
export enum ProductionSubtype {
	MPF = 'MPF', // Mass Production Facility
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
			type: OrderType.Production
			subtype: ProductionSubtype
			items: OrderItem[]
	  }
	| {
			type: OrderType.Transport
			subtype: TransportSubtype
			items: OrderItem[]
	  }

export class OrderManager {
    
}
