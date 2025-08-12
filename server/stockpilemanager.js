// StockpileManager.js
import FirestoreDb from './db.js';
import Stockpile from './stockpile.js';
import express from 'express';
export default class StockpileManager {
  constructor() {
    this.firestoreDb = new FirestoreDb();
    this.stockpiles = new Map(); // Map<stockpileName, Stockpile>
  }

  async createStockPile(region, subregion, name, code) {
    if (!region || !subregion || !name || !code) {
      throw new Error('region, subregion, name, and code are required');
    }

    if (!/^\d{6}$/.test(code)) {
      throw new Error('code must be a 6-digit number');
    }

    const stockpileName = `${region}_${subregion}_${name}`;

    const stockpile = new Stockpile(stockpileName, this.firestoreDb);
    await stockpile.create(code);
    this.stockpiles.set(stockpileName, stockpile);

    return stockpile;
  }


  async getStockpile(region, subregion, name) {
    if (!this.stockpiles.has(name)) {
      const stockpile = new Stockpile(`${region}_${subregion}_${name}`, this.firestoreDb);
      await stockpile.load();
      this.stockpiles.set(`${region}_${subregion}_${name}`, stockpile);
    }
    return this.stockpiles.get(`${region}_${subregion}_${name}`);
  }
}
