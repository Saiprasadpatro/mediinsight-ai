import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows process.env.API_KEY to be used in your code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Silences the warning for chunks under 1MB
    rollupOptions: {
      output: {
        // Splitting large vendor libraries into separate chunks for better caching and smaller file sizes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@google/genai')) {
              return 'vendor-genai';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});