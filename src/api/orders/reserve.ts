import { RoboRequest, RoboResponse } from '@robojs/server'
import { OrderManager, OrderType, ProductionSubtype, TransportSubtype } from '../../data/orders'
import BotService from '../../data/BotService'

export default async (req: RoboRequest) => {
	try {
		const body = await req.json()
		const orderName = body.orderName as string
		const username = body.username as string

		if (!orderName) {
			return RoboResponse.json({ error: 'Missing orderName' })
		}

		if (req.method === 'POST') {
			if (!username) {
				return RoboResponse.json({ error: 'Missing username for reservation' })
			}

			const order = await OrderManager.reserveOrder(orderName, username)
			if (order !== null) {
				await notifyOrderReserved('logistics', orderName, username, order.type, order.subtype)
			}
			return RoboResponse.json({ success: true, message: `Order "${orderName}" reserved by ${username}` })
		}

		if (req.method === 'DELETE') {
			await OrderManager.unreserveOrder(orderName, username)
			return RoboResponse.json({ success: true, message: `Order "${orderName}" has been unreserved` })
		}

		return RoboResponse.json({ error: 'Method not allowed' })
	} catch (err: any) {
		return RoboResponse.json({ error: err.message || 'Unknown error' })
	}
}

async function notifyOrderReserved(
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
				content = `${icon} **${type}** order **${orderName}** has been reserved by **${name}**\n CHOO CHOO!!!`
				return BotService.sendMessage(channelId, content)
			default:
				icon = '🚚'
		}
	}

	content = `${icon} **${type}** order **${orderName}** has been reserved by **${name}**`

	return BotService.sendMessage(channelId, content)
}
