import { Collection } from 'discord.js'

export interface StockpileItem {
  [itemName: string]: number
}

export interface Stockpile {
  name: string       // format: region_subregion_name
  code: string
  items: StockpileItem
}

export class StockpileManager {
  private static stockpiles: Collection<string, Stockpile> = new Collection()

  public static getStockpiles(): Stockpile[] {
    return this.stockpiles.map(s => s)
  }

  public static saveStockpiles(stockpiles: Stockpile[]): void {
    this.stockpiles = new Collection(stockpiles.map(s => [s.name, s]))
  }

  public static addOrUpdateStockpile(newStockpile: Stockpile): void {
    const existing = this.stockpiles.get(newStockpile.name)
    if (existing) {
      for (const [itemName, qty] of Object.entries(newStockpile.items)) {
        const prev = existing.items[itemName] ?? 0
        existing.items[itemName] = prev + qty
      }
      this.stockpiles.set(existing.name, existing)
    } else {
      this.stockpiles.set(newStockpile.name, newStockpile)
    }
  }

  public static createEmptyStockpile(region: string, subregion: string, name: string, code?: string): void {
    const combinedName = `${region}_${subregion}_${name}`
    const newStockpile: Stockpile = {
      name: combinedName,
      code: code ?? combinedName,
      items: {}
    }
    this.addOrUpdateStockpile(newStockpile)
  }

  public static getStockpilesByRegion(region: string): Stockpile[] {
    return this.stockpiles.filter(s => s.name.startsWith(region + '_')).map(s => s)
  }

  public static getAllRegions(): string[] {
    const set = new Set<string>()
    this.stockpiles.forEach(s => {
      const parts = s.name.split('_')
      if (parts.length > 0 && parts[0].length > 0) set.add(parts[0])
    })
    return Array.from(set)
  }

  public static removeAllStockpiles(): void {
    this.stockpiles.clear()
  }
}
