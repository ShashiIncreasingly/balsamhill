import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import htmlPurge from 'vite-plugin-purgecss';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), htmlPurge([htmlPurge()])],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    css: {
      devSourcemap: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/index.js',
        assetFileNames: 'assets/index.[ext]',
      },
    },
    minify: true,
  },
  css: {
    devSourcemap: true,
  },
});
