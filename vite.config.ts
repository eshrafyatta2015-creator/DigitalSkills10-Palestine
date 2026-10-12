import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/DigitalSkills10-Palestine/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
