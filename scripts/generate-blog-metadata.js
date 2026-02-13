import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import frontMatter from "front-matter";
import { compareDesc, parseISO } from "date-fns";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const blogPostsDir = path.join(projectRoot, "src", "blog-posts");
const outputPath = path.join(blogPostsDir, "metadata.json");

const files = fs.readdirSync(blogPostsDir).filter((f) => f.endsWith(".md"));

const metadata = files.map((filename) => {
  const filePath = path.join(blogPostsDir, filename);
  const content = fs.readFileSync(filePath, "utf-8");
  const { attributes } = frontMatter(content);
  const slug = path.basename(filename, ".md");
  return {
    slug,
    title: attributes?.title ?? "No Title",
    date: attributes?.date ?? "No Date",
  };
});

metadata.sort((a, b) =>
  compareDesc(parseISO(a.date), parseISO(b.date))
);

fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 0), "utf-8");
