import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional: makes imports easier
    },
  },
  build: {
    outDir: 'dist', // Ensure Netlify deploys from this folder
  },
  server: {
    port: 5173,
    open: true,
    // Optional: Proxy API requests to backend during dev
    proxy: {
      '/api': {
        target: 'https://backend-gemidoc.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
