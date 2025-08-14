import { RoboRequest, RoboResponse } from '@robojs/server';
import { StockpileManager } from '../../../data/stockpile';

export default async (req: RoboRequest) => {
    try {
        if (req.method !== 'POST') {
            return RoboResponse.json({ error: 'Method not allowed' });
        }

        const region = req.query['region'] as string;
        const subregion = req.query['subregion'] as string;
        const name = req.query['name'] as string;
        const itemName = req.query['itemName'] as string;
        const count = parseInt(req.query['count'] as string, 10);

        if (!region || !subregion || !name || !itemName || isNaN(count)) {
            return RoboResponse.json({ error: 'Missing required query parameters or invalid count' });
        }

        await StockpileManager.addItem(region, subregion, name, itemName, count);

        return RoboResponse.json({ message: 'Item added successfully' });
    } catch (error) {
        console.error('Error adding item:', error);
        return RoboResponse.json({ error: 'Internal server error' });
    }
};
