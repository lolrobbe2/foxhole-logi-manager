import { RoboRequest, RoboResponse } from '@robojs/server';
import { StockpileManager } from '../../data/stockpile';

export default async (req: RoboRequest) => {
    try {
        const region: string = req.query["region"] as string;
        const subregion: string = req.query["subregion"] as string;
        const name: string = req.query["name"] as string;

        if (region && subregion && name) {
            const stockpile = await StockpileManager.getSingleStockpile(region, subregion, name);
            if (stockpile == null) {
                return RoboResponse.json({ error: 'Stockpile not found' });
            }
            return RoboResponse.json(stockpile);
        }

        throw new Error("Missing required query parameters: region, subregion, name");
    } catch (error) {
        return RoboResponse.json({ error: (error as Error).message });
    }
};
