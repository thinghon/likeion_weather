import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // ngrok/localtunnel처럼 외부 터널 도메인으로 접속할 때 Vite가 Host 헤더를 막지 않도록 허용(dev 전용)
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
