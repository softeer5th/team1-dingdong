import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // mode에 따라 secure 옵션 설정
  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: isProduction,
          headers: {
            'credentials': 'include',
          },
          cookieDomainRewrite : "localhost"
        },
        '/ws': {
          target: env.VITE_WS_URL,
          changeOrigin: true,
          ws: true,
          secure: isProduction,
          headers: {
            'credentials': 'include',
          }
        }
      }
    },
  }
})
