import { RoboResponse } from '@robojs/server'
import { RoboRequest } from '@robojs/server'
import { StockpileManager } from '../objects/stockpile'

interface RequestBody {
	region?: string
}

export default async (req: RoboRequest) => {
	try {
    const region: string = req.query["region"] as string;
    if (region) {
      const filtered = await StockpileManager.getStockpilesByRegion(region)
		  return RoboResponse.json(filtered)
    }
    throw new Error("invalid query param");
    
		
	} catch (error) {
    console.log(req.body)
  }
	const all = await StockpileManager.getStockpiles()
	return RoboResponse.json(all)
}
