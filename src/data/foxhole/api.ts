// FoxholeApi.ts
import fetch from 'node-fetch';
import MapStructureTypes from './structures.js';

interface MapItem {
    iconType: number;
    [key: string]: unknown;
}

export interface MapTextItem {
    text: string;
    x: number;
    y: number;
    mapMarkerType: string; // Could be "Major" | "Minor" if enum is known
}

export interface StaticMapData {
    regionId: number;
    scorchedVictoryTowns: number;
    mapItems: unknown[];   // Replace unknown[] with a proper type when you know the shape
    mapItemsC: unknown[];
    mapItemsW: unknown[];
    mapTextItems: MapTextItem[];
    lastUpdated: number;
    version: number;
}


interface PublicMapData {
    mapItems: MapItem[];
    [key: string]: unknown;
}

interface MapResponse {
    [key: string]: unknown;
}

export default class FoxholeApi {
    private static getBaseUrl(): string {
        const baseUrl = process.env.FOXHOLE_WAR_URL;
        if (!baseUrl) {
            throw new Error('FOXHOLE_WAR_URL is not set in .env');
        }
        return baseUrl;
    }

    public static async getRequest<T>(endpoint: string): Promise<T | null> {
        const url = this.getBaseUrl() + endpoint;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return (await response.json()) as T;
        } catch (err) {
            return null;
        }
    }

    public static async getMaps(): Promise<string[] | null> {
        return await this.getRequest('/worldconquest/maps');
    }

    public static async getStaticMapData(mapName: string): Promise<StaticMapData | null> {
        return await this.getRequest(`/worldconquest/maps/${mapName}/static`) as StaticMapData | null;
    }

    public static async getPublicMapData(mapName: string): Promise<PublicMapData | null> {
        return await this.getRequest(`/worldconquest/maps/${mapName}/dynamic/public`) as PublicMapData | null;
    }

    public static async getPublicMapItems(mapName: string): Promise<MapItem[]> {
        const data = await this.getPublicMapData(mapName);
        return data?.mapItems ?? [];
    }

    public static async getPublicMPF(mapName: string): Promise<MapItem[]> {
        return (await this.getPublicMapItems(mapName)).filter(
            (item) => item.iconType === MapStructureTypes.MassProductionFactory
        );
    }

    public static async getPublicStockpile(mapName: string): Promise<MapItem[]> {
        return (await this.getPublicMapItems(mapName)).filter(
            (item) => item.iconType === MapStructureTypes.StorageFacility
        );
    }
}
