import { RoboRequest, RoboResponse } from '@robojs/server'
import { client } from 'robo.js'

const STATIC_ROLES = ['Admin', 'Moderator', 'Logistics', 'Support', 'Developer']

export default async (req: RoboRequest) => {
  try {
    if (req.method !== 'POST') {
      return RoboResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    const body = await req.json()
    const guildId = body.guildId as string

    if (!guildId) {
      return RoboResponse.json({ error: 'Missing guildId' }, { status: 400 })
    }

    const guild = await client.guilds.fetch(guildId)
    if (!guild) {
      return RoboResponse.json({ error: 'Guild not found' }, { status: 404 })
    }

    const members = await guild.members.fetch()
    const rolesByUser: Record<string, string[]> = {}

    members.forEach(member => {
      const username = member.user.username
      const filteredRoles = member.roles.cache
        .map(role => role.name)
        .filter(name => STATIC_ROLES.includes(name))

      if (filteredRoles.length > 0) {
        rolesByUser[username] = filteredRoles
      }
    })

    return RoboResponse.json({ rolesByUser })
  } catch (err: any) {
    console.error(err.message)
    return RoboResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
