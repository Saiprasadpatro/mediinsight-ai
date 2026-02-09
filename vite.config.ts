import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500, // Increased to 1.5MB to suppress the 500kb warning for large medical libraries
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-genai': ['@google/genai'],
          'vendor-charts': ['recharts'],
          'vendor-ui': ['lucide-react']
        }
      }
    }
  }
});