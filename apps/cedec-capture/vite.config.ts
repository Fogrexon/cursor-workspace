/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/cedec-capture/',
  build: {
    outDir: '../../docs/cedec-capture',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
  },
});
