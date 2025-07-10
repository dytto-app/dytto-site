import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
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