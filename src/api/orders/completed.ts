import { RoboRequest, RoboResponse } from '@robojs/server'
import { OrderManager, OrderType, ProductionSubtype, TransportSubtype } from '../../data/orders'
import BotService from '../../data/BotService'

export default async (req: RoboRequest) => {
	try {
		if (req.method !== 'POST') {
			return RoboResponse.json({ error: 'Method not allowed' })
		}

		const body = await req.json()
		const orderName = body.orderName as string

		if (!orderName) {
			return RoboResponse.json({ error: 'Missing orderName' })
		}

		const order = await OrderManager.completeOrder(orderName)
        notifyOrderCompleted('logistics',orderName,order.takenBy!, order.type, order.subtype);
		return RoboResponse.json({ success: true, message: `Order "${orderName}" has been completed.` })
	} catch (err: any) {
		return RoboResponse.json({ error: err.message || 'Unknown error' })
	}
}

async function notifyOrderCompleted(
	channelId: string,
	orderName: string,
	username: string,
	type: OrderType,
	subtype?: ProductionSubtype | TransportSubtype
) {
	const [name, discrim] = username.split('#')

	// Default icon
	let content: string = ''
	let icon = ':package:'
	if (type === OrderType.Production) {
		switch (subtype) {
			case ProductionSubtype.MPF:
				icon = '🏭⚡' // Mass Production Factory
				break
			case ProductionSubtype.Factory:
				icon = '🏭' // Regular Factory
				break
			case ProductionSubtype.Facility:
				icon = '🏗️' // Generic facility
				break
			default:
				icon = '🏭'
		}
	} else if (type === OrderType.Transport) {
		switch (subtype) {
			case TransportSubtype.Hauler:
				icon = '🚚'
				break
			case TransportSubtype.Flatbed:
				icon = '🚛'
				break
			case TransportSubtype.Ship:
				icon = '🚢'
				break
			case TransportSubtype.Train:
				icon = '🚆'
				content = `${icon} **${type}** order **${orderName}** has been completed by **${name}**\n CHOO CHOO MOTHER*******!!!`
				return BotService.sendMessage(channelId, content)
			default:
				icon = '🚚'
		}
	}

	content = `${icon} **${type}** order **${orderName}** has been completed by **${name}**`

	return BotService.sendMessage(channelId, content)
}
