import { RoboRequest, RoboResponse } from '@robojs/server'
import { Snowflake } from 'discord.js'
import { client } from 'robo.js'

export default async (req: RoboRequest) => {
	try {
		if (req.method !== 'PATCH') {
			return RoboResponse.json({ error: 'Method not allowed' }, { status: 405 })
		}

		const body = await req.json()
		const guildId = body.guildId as string
		const userId = body.userId as string
		const roleName = body.roleName as string
		const action = body.action as 'add' | 'remove'

		if (!guildId || !userId || !roleName || !action) {
			return RoboResponse.json({ error: 'Missing guildId, userId, roleName, or action' }, { status: 400 })
		}

		const guild = await client.guilds.fetch(guildId)
		if (!guild) {
			return RoboResponse.json({ error: 'Guild not found' }, { status: 404 })
		}

		const role = guild.roles.cache.find((r) => r.name === roleName)
		if (!role) {
			return RoboResponse.json({ error: `Role '${roleName}' not found` }, { status: 404 })
		}

		// Fetch member before updating roles
		let member = await guild.members.fetch({ user: userId as Snowflake, force: true })

		if (action === 'add') {
			await member.roles.add(role.id)
		} else if (action === 'remove') {
			await member.roles.remove(role.id)
		}

		// Fetch again to refresh cache after the update
		member = await guild.members.fetch({ user: userId as Snowflake, force: true })

		return RoboResponse.json({
			success: true,
			message: `Role '${roleName}' ${action}ed for user ${userId}`,
			roles: member.roles.cache.map((r) => ({ id: r.id, name: r.name }))
		})
	} catch (err: any) {
		return RoboResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
	}
}
