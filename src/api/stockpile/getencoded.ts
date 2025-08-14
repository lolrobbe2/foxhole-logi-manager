import { RoboRequest, RoboResponse } from '@robojs/server'
import { StockpileManager } from '../../data/stockpile'

interface RequestBody {
	region?: string
}

export default async (req: RoboRequest) => {
	try {
		const encodedname: string = req.query['encodedname'] as string
		if (encodedname) {
			const parts = encodedname.split('_')
			const filtered = await StockpileManager.getStockpilesByRegion(parts[0])

			return RoboResponse.json(filtered.filter((s) => (s.name = encodedname))[0])
		}
		throw new Error('invalid query param')
	} catch (error) {}
	return RoboResponse.json({ error: 'not found' })
}
