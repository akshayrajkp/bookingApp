import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // only used in dev
    proxy: {
      '/api/auth':     { target: 'http://localhost:8081', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/events':   { target: 'http://localhost:8083', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/bookings': { target: 'http://localhost:8082', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
      '/api/waitlist': { target: 'http://localhost:8087', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') },
    }
  }
});
