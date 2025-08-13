import { createCommandConfig, logger } from 'robo.js'
import type { ChatInputCommandInteraction } from 'discord.js'
import { StockpileManager } from '../../data/stockpile'

logger.info('registerd ping')
/*
 * Customize your command details and options here.
 *
 * For more information, see the documentation:
 * https://robojs.dev/discord-bots/commands#command-options
 */
export const config = createCommandConfig({
	description: 'Replies with Pong!',
	options: [
		{
			type: 'string',
			name: 'region',
			description: 'Region of the stockpile',
			required: false
		}
	]
} as const)

/**
 * This is your command handler that will be called when the command is used.
 * You can either use the `interaction` Discord.js object directly, or return a string or object.
 *
 * For more information, see the documentation:
 * https://robojs.dev/discord-bots/commands
 */
export default async (interaction: ChatInputCommandInteraction) => {
	logger.info(`list command used by ${interaction.user}`)
    const region = interaction.options.getString('region', false)
    if (region !== null) {
       const stockpiles = await StockpileManager.getStockpilesByRegion(region);
            const list = stockpiles
        .map(s => `${s.name}`)
        .join('\n')

        const response = `Stockpiles in region **${region}**:\n${list}`.slice(0, 1900)
        interaction.reply(response);
    }
}
