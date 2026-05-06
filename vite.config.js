/**
 * CONFIGURACIÓN: VITE
 * 
 * Configuración del servidor de desarrollo y build.
 * 
 * Características:
 * - Plugin de React para JSX
 * - Proxy API para desarrollo:
 *   * Redirige /api hacia http://localhost:3001 (backend)
 *   * Permite evitar problemas de CORS en desarrollo
 * 
 * Proxy config:
 * Las peticiones a /api durante desarrollo se envían al servidor backend.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
