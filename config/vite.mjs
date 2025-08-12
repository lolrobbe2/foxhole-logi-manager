import { DiscordProxy } from '@robojs/patch'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), DiscordProxy.Vite()],
	server: {
		host: '0.0.0.0',
		allowedHosts: true,
		fs: {
			strict: false,
		},
		historyApiFallback: true,
	},
}))
