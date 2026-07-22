import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/cursor-workspace/openworld-flight/',
  build: {
    outDir: '../../docs/openworld-flight',
    emptyOutDir: true,
  },
  test: {
    environment: 'node',
  },
});
