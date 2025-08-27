import { RoboRequest, RoboResponse } from '@robojs/server'
import { client } from 'robo.js'

const STATIC_ROLES: string[] = [
  'Infantry Division',
  'Front Line Engineer',
  'Forward Operating Base Team',
  'Front Line Logistics',
  'Back Line Logistics',
  'Armoured Division',
  'Mechanised Infantry (Light Armour)',
  'Recon Division (Partisan)',
  'Artillery Division',
  'Naval Division',
  'Base Builder Team',
  'Base Maintenance',
  'Medical Division'
]

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

    const members = await guild.members.list()

    const rolesByUser: Record<string, string[]> = {}

    members.forEach(member => {
      console.log(member);
      const username = member.user.username
      const filteredRoles = member.roles.cache
        .map(role => role.name)
      if (filteredRoles.length > 0) {
        rolesByUser[username] = filteredRoles
      }
    })

    return RoboResponse.json({ rolesByUser })
  } catch (err: any) {
    console.error('Error in /allroles:', err)
    return RoboResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
