import { Client, GatewayIntentBits, TextChannel } from 'discord.js'

class BotService {
	private static client: Client | null = null

	// Auto-initialize when the class is first loaded
	private static initialize() {
		if (this.client) return

		const token = process.env.DISCORD_TOKEN
		if (!token) {
			console.warn('VITE_DISCORD_TOKEN not set, bot will not connect')
			return
		}

		this.client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMembers]
		})

		this.client.login(token).catch((err) => console.error('Bot login failed:', err))

		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client?.user?.tag}`)
		})
	}
	public static async sendMessage(channelName: string, content: string) {
		if (!this.client) throw new Error('Bot client not initialized')

		// Find the channel by name across all guilds the bot is in
		let channel: TextChannel | undefined
		for (const guild of this.client.guilds.cache.values()) {
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
BotService['initialize']()

export default BotService
