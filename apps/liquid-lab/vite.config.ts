import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/liquid-lab/',
  build: {
    outDir: '../../docs/liquid-lab',
    emptyOutDir: true,
  },
});
