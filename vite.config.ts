import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pagesのリポジトリ名をここに設定します
const repoName = "sensor-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
});
