import { DiscordProxy } from '@robojs/patch'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),react(), DiscordProxy.Vite()],
	server: {
		host: '0.0.0.0',
		allowedHosts: true
	},
	optimizeDeps: {
  include: [],
  exclude: ['fsevents','@swc/core-win32-x64-msvc']
}
}))
