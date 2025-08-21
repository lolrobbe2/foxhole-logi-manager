import { RoboRequest, RoboResponse } from '@robojs/server'
import { OrderManager, OrderType, ProductionSubtype, TransportSubtype, OrderItem } from '../../data/orders'
import BotService from '../../data/BotService'

export default async (req: RoboRequest) => {
	try {
		if (req.method !== 'POST') {
			return RoboResponse.json({ error: 'Method not allowed' })
		}

		if (!req.body) {
			return RoboResponse.json({ error: 'Missing request body' })
		}

		const body = (await req.json()) as any
		console.log(body)
		const name = body.name as string
		const type = body.type as string
		const subtype = body.subtype as string
		const destination = body.destination as string
		const items = body.items as OrderItem[]
		const createdBy = body.createdBy as string
		const source = body.source as string
		// User info (who creates the order)

		if (name === null || type === null || subtype === null || destination === null || items === null) {
			return RoboResponse.json({ error: 'Missing required parameters or items is not an array' })
		}

		// Validate type and subtype
		let orderType: OrderType
		let orderSubtype: ProductionSubtype | TransportSubtype

		if (type === OrderType.Production) {
			if (!Object.values(ProductionSubtype).includes(subtype as ProductionSubtype)) {
				return RoboResponse.json({ error: `Invalid production subtype: ${subtype}` })
			}
			orderType = OrderType.Production
			orderSubtype = subtype as ProductionSubtype
		} else if (type === OrderType.Transport) {
			if (!Object.values(TransportSubtype).includes(subtype as TransportSubtype) && !source) {
				return RoboResponse.json({ error: `Invalid transport subtype: ${subtype}` })
			}
			orderType = OrderType.Transport
			orderSubtype = subtype as TransportSubtype
		} else {
			return RoboResponse.json({ error: `Invalid order type: ${type}` })
		}

		// Create the order with createdBy field
		await OrderManager.createOrder({
			name,
			type: orderType,
			subtype: orderSubtype,
			destination,
			items,
			createdBy: createdBy,
			source: source
		})

		await notifyOrderCreated('logistics', name, createdBy, type)

		return RoboResponse.json({ success: true, order: name })
	} catch (err: any) {
		return RoboResponse.json({ error: err.message || 'Unknown error' })
	}
}
async function notifyOrderCreated(
	channelId: string,
	orderName: string,
	username: string,
	type: OrderType,
	subtype?: ProductionSubtype | TransportSubtype
) {
	const [name, discrim] = username.split('#')

	// Default icon
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
				break
			default:
				icon = '🚚'
		}
	}

	const content = `${icon} New **${type}** order **${orderName}** has been created by **${name}**`
	return BotService.sendMessage(channelId, content)
}
