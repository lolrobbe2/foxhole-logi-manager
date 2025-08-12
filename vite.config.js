import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/foxhole-logi-manager/',  // <-- your repo name here
  plugins: [react()],
})
