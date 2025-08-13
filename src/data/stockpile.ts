import { Collection } from 'discord.js'
import FirestoreCollection from './collection'
import FirestoreDocument from './FirestoreDocument'

export interface StockpileItem {
    name: string;
    count: number;
}

export interface Stockpile {
	name: string // format: region_subregion_name
	code: string
	items: StockpileItem[]
}

export class StockpileManager {
	private static stockpileCollection = new FirestoreCollection<Stockpile>('stockpiles')

	public static async getStockpiles(): Promise<Stockpile[]> {
		const docs: FirestoreDocument<Stockpile>[] = await this.stockpileCollection.getDocs()

		const stockpiles: Stockpile[] = []
		for (const doc of docs) {
			const data = await doc.get()
			if (data) stockpiles.push(data)
		}

		return stockpiles
	}

	public static async createEmptyStockpile(
		region: string,
		subregion: string,
		name: string,
		code?: string
	): Promise<void> {
		const combinedName = `${region}_${subregion}_${name}`
		const docRef: FirestoreDocument<Stockpile> = this.stockpileCollection.doc(combinedName)

		// Check if it already exists
		const existingDoc = await docRef.get()
		if (existingDoc != null) {
			throw new Error(`A stockpile with the name "${combinedName}" already exists.`)
		}

		const newStockpile: Stockpile = {
			name: combinedName,
			code: code ?? combinedName,
			items: []
		}

		// Add the document to Firestore
		await docRef.set(newStockpile)
	}

	public static async getStockpilesByRegion(region: string): Promise<Stockpile[]> {
		const docs: FirestoreDocument<Stockpile>[] = await this.stockpileCollection.getDocs()

		const stockpiles: Stockpile[] = []
		for (const doc of docs) {
			const data = await doc.get()
			if (data && data.name.startsWith(region + '_')) {
				stockpiles.push(data)
			}
		}

		return stockpiles
	}

	public static async getAllRegions(): Promise<string[]> {
		const docs: FirestoreDocument<Stockpile>[] = await this.stockpileCollection.getDocs()

		const set = new Set<string>()
		for (const doc of docs) {
			const data = await doc.get()
			if (data) {
				const parts = data.name.split('_')
				if (parts.length > 0 && parts[0].length > 0) set.add(parts[0])
			}
		}

		return Array.from(set)
	}

	public static async removeAllStockpiles(): Promise<void> {
		const docs: FirestoreDocument<Stockpile>[] = await this.stockpileCollection.getDocs()

		for (const doc of docs) {
			await doc.delete()
		}
	}
	public static async removeStockpile(region: string, subregion: string, name: string): Promise<void> {
		const combinedName = `${region}_${subregion}_${name}`
		const doc: FirestoreDocument<Stockpile> = this.stockpileCollection.doc(combinedName)
		await doc.delete()
	}
}
