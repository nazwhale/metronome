import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Markdown from "vite-plugin-md";
import sitemap from "vite-plugin-sitemap";
import fs from "fs";
import path from "path";

function getArticleSlugs() {
  const directoryPath = path.resolve(__dirname, "src/blog-posts");
  const files = fs.readdirSync(directoryPath);

  const fileNames = files.map((file) => {
    const withoutExtension = file.replace(".md", "");
    return `/articles/${withoutExtension}`;
  });

  return fileNames;
}

function getDictionaryTermSlugs() {
  // Read the terms.ts file and extract slugs
  const termsFilePath = path.resolve(__dirname, "src/Dictionary/terms.ts");
  const fileContent = fs.readFileSync(termsFilePath, "utf-8");

  // Extract all slug values using regex
  const slugMatches = fileContent.matchAll(/slug:\s*["']([^"']+)["']/g);
  const slugs = Array.from(slugMatches, (match) => `/dictionary/${match[1]}`);

  return slugs;
}

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  server: { port: 9999 },
  plugins: [
    react(),
    Markdown(),
    sitemap({
      hostname: "https://www.tempotick.com",
      dynamicRoutes: [
        "/",
        "/online-metronome",
        "/circle-of-fifths-metronome",
        "/speed-trainer-metronome",
        "/youtube-looper",
        "/chord-progression-trainer",
        "/melodic-dictation-trainer",
        "/prompts-for-guitar",
        "/chord-chart-converter",
        "/articles",
        ...getArticleSlugs(),
        "/dictionary",
        ...getDictionaryTermSlugs(),
        // Localized routes
        "/es/metronomo",
        "/fi/metronomi",
      ],
      priority: 0.7,
      generateRobotsTxt: true,
      robots: [{ userAgent: "*", allow: "/" }],
    }),
  ],
  assetsInclude: ["**/*.md"],
});
