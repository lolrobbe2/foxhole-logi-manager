import DiscordService from '../../app/discord'
// Stub: you should provide this externally or implement your real Discord connection check

import { Flashcore } from 'robo.js'
//const Flashcore = {};
export interface StockpileItem {
	[itemName: string]: number
}

export interface Stockpile {
	name: string // format: region_subregion_name
	code: string
	items: StockpileItem
}

export class StockpileManager {
	public static async getStockpiles(): Promise<Stockpile[]> {
		const response = await fetch('api/stockpiles/get', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}) // empty body to get all stockpiles
		})
		if (!response.ok) {
			throw new Error(`Failed to fetch stockpiles: ${response.statusText}`)
		}
		return (await response.json()) as Stockpile[]
	}

	public static async saveStockpiles(stockpiles: Stockpile[]): Promise<void> {}

	public static async addOrUpdateStockpile(newStockpile: Stockpile): Promise<void> {}

	public static async createEmptyStockpile(
		region: string,
		subregion: string,
		name: string,
		code?: string
	): Promise<void> {}

	/**
	 * Return all stockpiles whose name starts with the given region.
	 * Region is the first segment of the name (before the first underscore).
	 */
	public static async getStockpilesByRegion(region: string): Promise<Stockpile[]> {
		// build the URL with optional query param
		let url = 'api/stockpiles/get'
		if (region) {
			url += `?region=${encodeURIComponent(region)}`
		}

		const response = await fetch(url, {
			method: 'GET', // switch to GET since you're using query params
			headers: { 'Content-Type': 'application/json' }
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch stockpiles: ${response.statusText}`)
		}

		return (await response.json()) as Stockpile[]
	}

	/**
	 * Return a list of unique regions discovered in stored stockpile names.
	 * Region is the first segment of the name (before the first underscore).
	 */
	public static async getAllRegions(): Promise<string[]> {
		try {
			const response = await fetch('http://localhost:3000/api/stockpile/getregions')

			if (!response.ok) {
				throw new Error(`Failed to fetch regions: ${response.status} ${response.statusText}`)
			}

			const regions: string[] = await response.json()
			return regions
		} catch (error) {
			console.error('Error fetching regions:', error)
			return []
		}
	}

	/**
	 * Remove all stored stockpiles.
	 */
	public static async removeAllStockpiles(): Promise<void> {
		return
	}
}
