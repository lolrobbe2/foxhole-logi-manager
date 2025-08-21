import { RoboRequest, RoboResponse } from '@robojs/server'
import { OrderManager } from '../../data/orders'

export default async (req: RoboRequest) => {
    if (req.method !== 'GET') {
        return RoboResponse.json({ error: 'Method not allowed' })
    }

    try {
        const orders = await OrderManager.getOrders();
        return RoboResponse.json({ success: true, orders })
    } catch (err: any) {
        return RoboResponse.json({ error: err.message || 'Failed to retrieve orders' })
    }
}
