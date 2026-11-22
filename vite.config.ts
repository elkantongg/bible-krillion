import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API = `http://localhost:${process.env.API_PORT ?? 8787}`

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT ?? 5280),
    strictPort: true,
    host: true,
    proxy: {
      '/api': API,
      '/socket.io': { target: API, ws: true },
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'], env: { NODE_NO_WARNINGS: '1' } },
} as any)
