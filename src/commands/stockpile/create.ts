import { createCommandConfig, logger } from 'robo.js'
import type { ChatInputCommandInteraction } from 'discord.js'
import { StockpileManager } from '../../data/stockpile'
logger.info('registered create stockpile command')

function isValidCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

export const config = createCommandConfig({
  description: 'Create an empty stockpile by region, subregion, name, and 6-digit code',
  options: [
    {
      type: 'string',
      name: 'region',
      description: 'Region of the stockpile',
      required: true
    },
    {
      type: 'string',
      name: 'subregion',
      description: 'Subregion of the stockpile',
      required: true
    },
    {
      type: 'string',
      name: 'name',
      description: 'Name of the stockpile',
      required: true
    },
    {
      type: 'string',
      name: 'code',
      description: '6-digit numeric code',
      required: true
    }
  ]
} as const)

export default async (interaction: ChatInputCommandInteraction) => {
  const region = interaction.options.getString('region', true)
  const subregion = interaction.options.getString('subregion', true)
  const name = interaction.options.getString('name', true)
  const code = interaction.options.getString('code', true)


  if (!isValidCode(code)) {
    await interaction.reply({ content: 'Error: Code must be exactly 6 digits numeric.', ephemeral: true })
    return
  }

  await StockpileManager.createEmptyStockpile(region, subregion, name, code)

  await interaction.reply(`Stockpile created: ${region}_${subregion}_${name} by ${interaction.user.globalName})`)
}
