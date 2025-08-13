export interface StockpileItem {
	[itemName: string]: number
}

export class Stockpile {
    name: string; // format: region_subregion_name
    code: string;
    items: StockpileItem[];

    constructor(name: string, code: string, items: StockpileItem[]) {
        this.name = name;
        this.code = code;
        this.items = items;
    }

    /** Returns the region part of the stockpile name */
    public static getRegion(stockpile: Stockpile): string {
        return stockpile.name.split("_")[0] ?? "";
    }

    /** Returns the subregion part of the stockpile name */
    public static getSubregion(stockpile: Stockpile): string {
        return stockpile.name.split("_")[1] ?? "";
    }

    /** Returns the display name part of the stockpile name */
    public static getDisplayName(stockpile: Stockpile): string {
        const parts = stockpile.name.split("_");
        return parts.slice(2).join("_") ?? "";
    }

    /** Returns the raw region for API calls (no spaces, with Hex suffix) */
    public static getRawRegion(stockpile: Stockpile): string {
        const rawRegion = stockpile.name.split("_")[0] ?? "";
        return rawRegion.replace(/\s+/g, "") + "Hex";
    }
}

export class StockpileManager {
	public static async getStockpiles(): Promise<Stockpile[]> {
		const response = await fetch('api/stockpile/get', {
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
	): Promise<void> {
		const params = new URLSearchParams({
			region,
			subregion,
			name
		})

		if (code) {
			params.append('code', code)
		}

		const response = await fetch(`/api/stockpile/create?${params.toString()}`, {
			method: 'POST'
		})

		if (!response.ok) {
			const text = await response.text()
			throw new Error(`Failed to create stockpile: ${text}`)
		}
	}

	/**
	 * Return all stockpiles whose name starts with the given region.
	 * Region is the first segment of the name (before the first underscore).
	 */
	public static async getStockpilesByRegion(region: string): Promise<Stockpile[]> {
		// build the URL with optional query param
		let url = 'api/stockpile/get'
		if (region) {
			url += `?region=${encodeURIComponent(region)}`
		}

		const response = await fetch(url, {
			method: 'GET', // switch to GET since you're using query params
		})
		
		if (!response.ok) {
			throw new Error(`Failed to fetch stockpiles: ${response.statusText}`)
		}

		return (await response.json()) as Stockpile[]
	}

	public static async getStockpileByEncodedName(encodedName: string): Promise<Stockpile | undefined> {
		// build the URL with optional query param
		let url = 'api/stockpile/getencoded'
		if (encodedName) {
			url += `?encodedname=${encodeURIComponent(encodedName)}`
		}

		const response = await fetch(url, {
			method: 'GET', // switch to GET since you're using query params
			headers: { 'Content-Type': 'application/json' }
		})
		
		if (!response.ok) {
			throw new Error(`Failed to fetch stockpiles: ${response.statusText}`)
		}
		const data = await response.json();
		return (data) as Stockpile
	}

	/**
	 * Return a list of unique regions discovered in stored stockpile names.
	 * Region is the first segment of the name (before the first underscore).
	 */
	public static async getAllRegions(): Promise<string[]> {
		try {
			const response = await fetch('api/stockpile/getregions')

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
