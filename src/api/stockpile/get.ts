import { RoboResponse } from '@robojs/server'
import { RoboRequest } from '@robojs/server'
import { StockpileManager } from '../objects/stockpile'

interface RequestBody {
	region?: string
}

export default async (req: RoboRequest) => {
	try {
		let region = (await req.json()) as string
		const filtered = await StockpileManager.getStockpilesByRegion(region)
		return RoboResponse.json(filtered)
	} catch (error) {}

	const all = await StockpileManager.getStockpiles()
	return RoboResponse.json(all)
}
