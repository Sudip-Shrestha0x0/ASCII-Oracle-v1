/**
 * ASCII Oracle - Vite Configuration
 * Created by Light
 * Configures dev server, build, and worker support
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          xterm: ['@xterm/xterm'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    include: ['three', '@xterm/xterm'],
  },
});
