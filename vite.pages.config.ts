// Static build used only for free static hosting (GitHub Pages).
// It bundles the same UI as a client-only SPA — no server needed.
// Run: bun run build:pages   (output: dist-pages/)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Relative base: works at https://user.github.io/repo/ and at a custom domain.
  base: "./",
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL("./index.pages.html", import.meta.url)),
    },
  },
});
