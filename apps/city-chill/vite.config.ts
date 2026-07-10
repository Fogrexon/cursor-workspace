import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/city-chill/',
  build: {
    outDir: '../../docs/city-chill',
    emptyOutDir: true,
  },
});
