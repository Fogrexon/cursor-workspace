import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/temperature-converter/',
  build: {
    outDir: '../../docs/temperature-converter',
    emptyOutDir: true,
  },
});
