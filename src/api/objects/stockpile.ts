import DiscordService from '../discord'

export class StockpileManager {
  private static readonly STORE_KEY = 'stockpiles'

  // Stub: you should provide this externally or implement your real Discord connection check
  private static isConnected(): boolean {
    // e.g. return yourDiscordSdk.isConnected
    return DiscordService.isConnected() // placeholder
  }

  private static async getFlashcore(): Promise<typeof import('robo.js').Flashcore | null> {
    if (!this.isConnected()) return null
    // dynamic import
    const mod = await import('robo.js')
    return mod.Flashcore
  }

  private static async parseStored(value: unknown): Promise<Stockpile[]> {
    if (!value) return []
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as Stockpile[]
      } catch {
        return []
      }
    }
    try {
      return value as Stockpile[]
    } catch {
      return []
    }
  }

  public static async getStockpiles(): Promise<Stockpile[]> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return []
    const stored = await Flashcore.get(StockpileManager.STORE_KEY)
    return await this.parseStored(stored)
  }

  public static async saveStockpiles(stockpiles: Stockpile[]): Promise<void> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return
    await Flashcore.set(StockpileManager.STORE_KEY, JSON.stringify(stockpiles))
  }

  public static async addOrUpdateStockpile(newStockpile: Stockpile): Promise<void> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return
    const stockpiles = await this.getStockpiles()
    const index = stockpiles.findIndex((s) => s.name === newStockpile.name)

    if (index >= 0) {
      const existing = stockpiles[index]
      for (const [itemName, qty] of Object.entries(newStockpile.items)) {
        const prev = existing.items[itemName] ?? 0
        existing.items[itemName] = prev + qty
      }
      stockpiles[index] = existing
    } else {
      stockpiles.push(newStockpile)
    }

    await this.saveStockpiles(stockpiles)
  }

  public static async createEmptyStockpile(region: string, subregion: string, name: string, code?: string): Promise<void> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return
    const combinedName = `${region}_${subregion}_${name}`
    const newStockpile: Stockpile = {
      name: combinedName,
      code: code ?? combinedName,
      items: {}
    }
    await this.addOrUpdateStockpile(newStockpile)
  }

  public static async getStockpilesByRegion(region: string): Promise<Stockpile[]> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return []
    const all = await this.getStockpiles()
    return all.filter((s) => {
      const parts = s.name.split('_')
      return parts[0] === region
    })
  }

  public static async getAllRegions(): Promise<string[]> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return []
    const all = await this.getStockpiles()
    const set = new Set<string>()
    for (const s of all) {
      const parts = s.name.split('_')
      if (parts.length > 0 && parts[0].length > 0) set.add(parts[0])
    }
    return Array.from(set)
  }

  public static async removeAllStockpiles(): Promise<void> {
    const Flashcore = await this.getFlashcore()
    if (!Flashcore) return
    await Flashcore.delete(StockpileManager.STORE_KEY)
  }
}
