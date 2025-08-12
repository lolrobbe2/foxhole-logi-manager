import dotenv from 'dotenv';
import fetch from 'node-fetch';
import MapStructureTypes from './foxholestructures.js';

export default class FoxholeApi {
    static async getRequest(endpoint) {
    const baseUrl = process.env.FOXHOLE_WAR_URL;
    if (!baseUrl) {
      throw new Error('FOXHOLE_WAR_URL is not set in .env');
    }

    const url = baseUrl + endpoint;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json()
      return res;
    } catch (err) {
      console.error(`Failed to fetch from ${url}:`, err);
      return null;
    }
  }
  static async getMaps() {
    return await FoxholeApi.getRequest('/worldconquest/maps');
  }
  static async getStaticMapData(mapName) {
    return await FoxholeApi.getRequest(`/worldconquest/maps/${mapName}/static`);
  }
  static async getPublicMapData(mapName) {
    return await FoxholeApi.getRequest(`/worldconquest/maps/${mapName}/dynamic/public`);
  }
  static async getPublicMapitems(mapName) {
    return (await FoxholeApi.getRequest(`/worldconquest/maps/${mapName}/dynamic/public`)).mapItems;
  }
  static async getPublicMPF(mapName) {
    return (await this.getPublicMapitems(mapName)).filter((item) => item.iconType === MapStructureTypes.MassProductionFactory);
  }
  static async getPublicStockpile(mapName) {
    return (await this.getPublicMapitems(mapName)).filter((item) => item.iconType === MapStructureTypes.StorageFacility);
  }
}