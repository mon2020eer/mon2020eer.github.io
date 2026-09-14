import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * المصدر في src/، والمُخرَج يُكتب في جذر المستودع مباشرة
 * لأن GitHub Pages يخدم الجذر. assets/ (الوسائط) لا تُمس.
 *
 * base: "./" ضروري — يجعل روابط الحزمة نسبية، فتعمل النسخة نفسها
 * على amt.com.ly وداخل معاينة الـ Artifact دون تعديل.
 */
export default defineConfig({
  root: "src",
  base: "./",
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: "..",
    emptyOutDir: false,
    assetsDir: "build",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "build/app-[hash].js",
        chunkFileNames: "build/[name]-[hash].js",
        assetFileNames: "build/[name]-[hash][extname]",
      },
    },
  },
});
