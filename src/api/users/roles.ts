import { RoboRequest, RoboResponse } from '@robojs/server'
import { Snowflake } from 'discord.js'
import { client } from 'robo.js'

function isSnowflake(id: string): id is Snowflake {
    return /^\d{17,20}$/.test(id); // Discord snowflakes are 17–20 digit numbers
}

export default async (req: RoboRequest) => {
    try {
        if (req.method !== 'POST') {
            return RoboResponse.json({ error: 'Method not allowed' }, { status: 405 })
        }

        const body = await req.json()
        const guildId = body.guildId as string
        const userId = body.userId as string

        if (!guildId || !userId) {
            return RoboResponse.json({ error: 'Missing guildId or userId' }, { status: 400 })
        }

        if (!isSnowflake(guildId)) {
            console.error('Invalid guildId received:', guildId)
            return RoboResponse.json({ error: 'Invalid guildId (must be a Discord snowflake)' }, { status: 400 })
        }

        if (!isSnowflake(userId)) {
            console.error('Invalid userId received:', userId)
            return RoboResponse.json({ error: 'Invalid userId (must be a Discord snowflake)' }, { status: 400 })
        }

        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
            return RoboResponse.json({ error: 'Guild not found' }, { status: 404 })
        }

        const member = await guild.members.fetch(userId)
        if (!member) {
            return RoboResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        const roles = member.roles.cache.map(role => ({
            id: role.id,
            name: role.name
        }))

        return RoboResponse.json({ roles })
    } catch (err: any) {
        return RoboResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
    }
}
