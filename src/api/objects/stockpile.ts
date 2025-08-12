import DiscordService from '../../app/discord'
  // Stub: you should provide this externally or implement your real Discord connection check

import { Flashcore } from 'robo.js'
//const Flashcore = {};
export interface StockpileItem {
  [itemName: string]: number
}

export interface Stockpile {
  name: string       // format: region_subregion_name
  code: string
  items: StockpileItem
}

export class StockpileManager {
  private static readonly STORE_KEY = 'stockpiles'

  private static isConnected(): boolean {
    // e.g. return yourDiscordSdk.isConnected
    console.log(`[Discord] Connection status checked: ${DiscordService.isConnected() ? 'Connected' : 'Disconnected'}`);

    return DiscordService.isConnected() // placeholder
  }// src/lib/StockpileManager.ts

  private static async parseStored(value: unknown): Promise<Stockpile[]> {
    if (!value) return []
    // Flashcore can return objects or strings depending on usage / versions.
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as Stockpile[]
      } catch {
        return []
      }
    }
    // assume already structured
    try {
      return value as Stockpile[]
    } catch {
      return []
    }
  }

  public static async getStockpiles(): Promise<Stockpile[]> {
    const stored = await Flashcore.get(StockpileManager.STORE_KEY)
    return await StockpileManager.parseStored(stored)
  }

  public static async saveStockpiles(stockpiles: Stockpile[]): Promise<void> {
    // store as JSON string to be consistent
    await Flashcore.set(StockpileManager.STORE_KEY, JSON.stringify(stockpiles))
  }

  public static async addOrUpdateStockpile(newStockpile: Stockpile): Promise<void> {
    const stockpiles = await this.getStockpiles()
    const index = stockpiles.findIndex((s) => s.name === newStockpile.name)

    if (index >= 0) {
      const existing = stockpiles[index]
      // merge items: add quantities for existing items
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
    const combinedName = `${region}_${subregion}_${name}`
    const newStockpile: Stockpile = {
      name: combinedName,
      code: code ?? combinedName,
      items: {}
    }
    await this.addOrUpdateStockpile(newStockpile)
  }

  /**
   * Return all stockpiles whose name starts with the given region.
   * Region is the first segment of the name (before the first underscore).
   */
  public static async getStockpilesByRegion(region: string): Promise<Stockpile[]> {
    const all = await this.getStockpiles()
    return all.filter((s) => {
      const parts = s.name.split('_')
      return parts[0] === region
    })
  }

  /**
   * Return a list of unique regions discovered in stored stockpile names.
   * Region is the first segment of the name (before the first underscore).
   */
  public static async getAllRegions(): Promise<string[]> {
    const all = await this.getStockpiles()
    const set = new Set<string>()
    for (const s of all) {
      const parts = s.name.split('_')
      if (parts.length > 0 && parts[0].length > 0) set.add(parts[0])
    }
    return Array.from(set)
  }

  /**
   * Remove all stored stockpiles.
   */
  public static async removeAllStockpiles(): Promise<void> {
    await Flashcore.delete(StockpileManager.STORE_KEY)
  }
}