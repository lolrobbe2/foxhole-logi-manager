import { createCommandConfig, logger } from 'robo.js'
import type { ChatInputCommandInteraction } from 'discord.js'
import { StockpileManager } from '../../data/stockpile'

logger.info('registered clear stockpiles command')

export const config = createCommandConfig({
  description: 'Clears all stored stockpiles',
  options: []
} as const)

export default async (interaction: ChatInputCommandInteraction) => {
  logger.info(`clear command used by ${interaction.user.tag}`)

  await StockpileManager.removeAllStockpiles()

  await interaction.reply({
    content: 'All stockpiles have been cleared successfully.',
    ephemeral: true // only visible to the user who used the command
  })
}
