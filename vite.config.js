import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: false,
      ignored: ['**/public/images/**', '**/node_modules/**'],
    },
    port: 5173,
    host: true,
  },
})
