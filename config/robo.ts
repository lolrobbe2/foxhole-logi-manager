import type { Config } from 'robo.js'

export default <Config>{
	clientOptions: {
		intents: ['Guilds', 'GuildMessages']
	},
	experimental: {
		disableBot: true
	},
	plugins: [],
	type: 'robo',
	watcher: {
		ignore: ['src\\app', 'src\\components', 'src\\hooks']
	}
}
