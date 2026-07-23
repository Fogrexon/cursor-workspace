/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const workspaceRoot = resolve(__dirname, '../..');

export default defineConfig({
  base: '/cursor-workspace/report-viewer/',
  build: {
    outDir: '../../docs/report-viewer',
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
  test: {
    environment: 'jsdom',
  },
});
