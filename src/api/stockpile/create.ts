import { RoboRequest, RoboResponse } from '@robojs/server';
import { StockpileManager } from '../../data/stockpile';

export default async (req: RoboRequest) => {
  try {
    if (req.method !== 'POST') {
      return RoboResponse.json({ error: 'Method not allowed' });
    }

    const region = req.query['region'] as string;
    const subregion = req.query['subregion'] as string;
    const name = req.query['name'] as string;
    const code = req.query['code'] as string | undefined;

    if (!region || !subregion || !name) {
      return RoboResponse.json({ error: 'Missing required query parameters' });
    }

    await StockpileManager.createEmptyStockpile(region, subregion, name, code);

    return RoboResponse.json({ message: 'Stockpile created successfully' });
  } catch (error) {
    return RoboResponse.json({ error: 'Internal server error' });
  }
};
