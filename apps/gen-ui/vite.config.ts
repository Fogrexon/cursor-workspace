import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(rootDir, "src/client"),
  publicDir: path.resolve(rootDir, "public"),
  build: {
    outDir: path.resolve(rootDir, "dist/client"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@playground/gen-ui": path.resolve(rootDir, "../../lib/gen-ui/src/index.ts"),
      "@playground/theme": path.resolve(rootDir, "../../lib/theme"),
    },
  },
});
