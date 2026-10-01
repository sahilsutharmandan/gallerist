import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxy = {
  '/cma': {
    target: 'https://openaccess-api.clevelandart.org',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/cma/, '/api'),
  },
}

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
})
