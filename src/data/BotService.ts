import { TextChannel } from 'discord.js'
import { client } from 'robo.js'
class BotService {


	public static async sendMessage(channelName: string, content: string) {
		if (!client) throw new Error('Bot client not initialized')

		// Find the channel by name across all guilds the bot is in
		let channel: TextChannel | undefined
		for (const guild of client.guilds.cache.values()) {
			const found = guild.channels.cache.find((c) => c.name === channelName && c instanceof TextChannel) as
				| TextChannel
				| undefined

			if (found) {
				channel = found
				break
			}
		}

		if (!channel) {
			throw new Error(`Channel "${channelName}" not found or is not a text channel`)
		}

		return channel.send({ content })
	}
}

// Auto-initialize as soon as the module is imported

export default BotService
