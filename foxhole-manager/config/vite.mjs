import { DiscordProxy } from '@robojs/patch'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({

	plugins: [react(), DiscordProxy.Vite()],
	base: mode === 'production' ? 'https://lolrobbe2.github.io/foxhole-logi-manager/' : '/',
	server: {
		allowedHosts: true
	}
}))
