// Stockpile.js
import { collection, setDoc, doc, getDoc } from "firebase/firestore"; 
import FirestoreDb from './db.js';

export default class Stockpile {
  constructor(name, firestoreDb) {
    this.name = name;
    this.firestoreDb = firestoreDb;
    this.inventory = new Map();
    this.stockpiles = collection(this.firestoreDb.getInstance(),'stockpiles');
  }

    getDocPath() {
        // Assuming 'name' is something like "deadland_default_stockpile"
        // so full path is 'stockpiles/deadland_default_stockpile'
        return `stockpiles/${this.name}`;
    }

    async load() {
        const stockpile = doc(this.stockpiles, this.name);
        const data = (await getDoc(stockpile)).data();
        if (data) {
            this.inventory = data.items? new Map(Object.entries(data.items)) : new Map();
            this.code = data.code ?? null;
        } else {
            this.inventory = new Map();
            this.code = null;
        }
    }


    async save() {
        const inventoryObj = Object.fromEntries(this.inventory);
        const stockpile = doc(this.stockpiles, this.name);
        const data = { items: inventoryObj };
        if (this.code !== undefined) {
            data.code = this.code;
        }
        return await setDoc(stockpile, data);
    }


  addItem(itemName, count) {
    if (count <= 0) return;
    const current = this.inventory.get(itemName) ?? 0;
    this.inventory.set(itemName, current + count);
  }

  removeItem(itemName, count) {
    if (count <= 0) return false;
    const current = this.inventory.get(itemName) ?? 0;
    if (current < count) return false;
    if (current === count) {
      this.inventory.delete(itemName);
    } else {
      this.inventory.set(itemName, current - count);
    }
    return true;
  }

  getItemCount(itemName) {
    return this.inventory.get(itemName) ?? 0;
  }

  getInventory() {
    return Object.fromEntries(this.inventory);
  }

  async create(code) {
    const stockpile = doc(this.stockpiles,this.name)
    return await setDoc(stockpile,{ items: {}, code });
  }
}
