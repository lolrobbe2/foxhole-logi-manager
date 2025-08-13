import { RoboRequest, RoboResponse } from '@robojs/server';
import FoxholeApi from "../../data/foxhole/api"


export default async (req: RoboRequest) => {
    try {
        const region: string = req.query['region'] as string;
        if (!region) {
            throw new Error('invalid query param');
        }

        const mapData = await FoxholeApi.getStaticMapData(region);
        if (!mapData || !mapData.mapTextItems) {
            return RoboResponse.json({ error: 'no map data found' });
        }

        const majorTexts = mapData.mapTextItems
            .filter((item: { mapMarkerType: string; }) => item.mapMarkerType === 'Major')
            .map((item: { text: any; }) => item.text);

        return RoboResponse.json(majorTexts);
    } catch (error) {
        console.error(error);
        return RoboResponse.json({ error: 'could not load region' });
    }
};
