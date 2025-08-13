// src/app/api/FoxholeApi.ts
export class FoxholeApi {
    private static readonly BASE_URL = '/api/foxhole';

    public static async getRegions(): Promise<string[]> {
        const response = await fetch(`${this.BASE_URL}/getregions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch regions: ${response.statusText}`);
        }

        return (await response.json()) as string[];
    }

    /**
     * Fetch subregions for a given region
     * @param region The region name
     */
    public static async getSubregions(region: string): Promise<string[]> {
        const response = await fetch(`${this.BASE_URL}/getsubregions?region=${encodeURIComponent(region)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch subregions: ${response.statusText}`);
        }

        return (await response.json()) as string[];
    }
}
