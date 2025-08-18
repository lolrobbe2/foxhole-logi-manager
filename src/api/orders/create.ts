import { RoboRequest, RoboResponse } from '@robojs/server'
import { OrderManager, OrderType, ProductionSubtype, TransportSubtype, OrderItem } from '../../data/orders'

export default async (req: RoboRequest) => {
  try {
    if (req.method !== 'POST') {
      return RoboResponse.json({ error: 'Method not allowed' })
    }

    const bodyText = await new Response(req.body).text()
    const body = JSON.parse(bodyText)

    const name = body.name as string
    const type = body.type as string
    const subtype = body.subtype as string
    const destination = body.destination as string
    const items = body.items as OrderItem[]

    if (!name || !type || !subtype || !destination || !items || !Array.isArray(items)) {
      return RoboResponse.json({ error: 'Missing required parameters or items is not an array' })
    }

    // Validate type and subtype
    let orderType: OrderType
    let orderSubtype: ProductionSubtype | TransportSubtype

    if (type === OrderType.Production) {
      if (!(subtype in ProductionSubtype)) {
        return RoboResponse.json({ error: `Invalid production subtype: ${subtype}` })
      }
      orderType = OrderType.Production
      orderSubtype = subtype as ProductionSubtype
    } else if (type === OrderType.Transport) {
      if (!(subtype in TransportSubtype)) {
        return RoboResponse.json({ error: `Invalid transport subtype: ${subtype}` })
      }
      orderType = OrderType.Transport
      orderSubtype = subtype as TransportSubtype
    } else {
      return RoboResponse.json({ error: `Invalid order type: ${type}` })
    }

    await OrderManager.createOrder({
      name,
      type: orderType,
      subtype: orderSubtype,
      destination,
      items
    })

    return RoboResponse.json({ message: 'Order created successfully' })
  } catch (error) {
    return RoboResponse.json({ error: 'Internal server error' })
  }
}
