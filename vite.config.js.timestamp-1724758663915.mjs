// vite.config.js
import react from "file:///Applications/XAMPP/xamppfiles/htdocs/html/git/balsam-react/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///Applications/XAMPP/xamppfiles/htdocs/html/git/balsam-react/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Applications/XAMPP/xamppfiles/htdocs/html/git/balsam-react/node_modules/vite-tsconfig-paths/dist/index.mjs";
import htmlPurge from "file:///Applications/XAMPP/xamppfiles/htdocs/html/git/balsam-react/node_modules/vite-plugin-purgecss/dist/index.mjs";
var __vite_injected_original_dirname = "/Applications/XAMPP/xamppfiles/htdocs/html/git/balsam-react";
var vite_config_default = defineConfig({
  plugins: [react(), tsconfigPaths(), htmlPurge([htmlPurge()])],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    css: {
      devSourcemap: true
    },
    rollupOptions: {
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/index.js",
        assetFileNames: "assets/index.[ext]"
      }
    },
    minify: true
  },
  css: {
    devSourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL2h0bWwvZ2l0L2JhbHNhbS1yZWFjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9odG1sL2dpdC9iYWxzYW0tcmVhY3Qvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9odG1sL2dpdC9iYWxzYW0tcmVhY3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuaW1wb3J0IGh0bWxQdXJnZSBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZWNzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB0c2NvbmZpZ1BhdGhzKCksIGh0bWxQdXJnZShbaHRtbFB1cmdlKCldKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGNzczoge1xuICAgICAgZGV2U291cmNlbWFwOiB0cnVlLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2luZGV4LmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvaW5kZXguanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9pbmRleC5bZXh0XScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbWluaWZ5OiB0cnVlLFxuICB9LFxuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVcsT0FBTyxXQUFXO0FBQ3JYLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGVBQWU7QUFKdEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFBQSxFQUM1RCxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQSxFQUNoQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
