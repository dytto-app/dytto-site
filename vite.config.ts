import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@ayaan/analytics', 'mixpanel-browser'],
  },
  resolve: {
    alias: {
      // Resolve mixpanel-browser from this project's node_modules
      'mixpanel-browser': path.resolve(__dirname, 'node_modules/mixpanel-browser'),
    },
  },
  // Add fallback for client-side routing
  server: {
    historyApiFallback: true,
  },
  // Ensure proper routing for production builds
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});