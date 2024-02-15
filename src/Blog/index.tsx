import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDateStr } from "./utils.tsx";
import frontMatter from "front-matter";
import { compareDesc, parseISO } from "date-fns";

export interface BlogPostMetadata {
  title: string;
  date: string;
  slug: string;
}

interface BlogPost {
  metadata: BlogPostMetadata;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      // Dynamically import all .md files from the blog-posts directory
      const markdownImports = import.meta.glob("..//blog-posts/*.md", {
        as: "raw",
      });

      const markdownPromises = Object.entries(markdownImports).map(
        async ([filePath, resolver]) => {
          const markdownContent = await resolver();

          const { attributes }: { attributes: BlogPostMetadata } =
            frontMatter(markdownContent);

          // get post slug from file name
          const slug = filePath.split("/").pop()?.split(".")[0] || "";

          // Extract the slug and title from the front matter
          const title = attributes.title || "No Title";
          const date = attributes.date || "No Date";

          return {
            metadata: {
              title,
              date,
              slug,
            },
          };
        },
      );

      const loadedPosts: BlogPost[] = await Promise.all(markdownPromises);
      loadedPosts.sort((a, b) => {
        return compareDesc(
          parseISO(a.metadata.date),
          parseISO(b.metadata.date),
        );
      });

      setPosts(loadedPosts);
    };

    loadPosts().catch((error) => {
      console.error("Error loading posts:", error);
    });
  }, []);

  return (
    <div>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <Link
              className={`link link-neutral`}
              to={`/articles/${post.metadata.slug}`}
            >
              {post.metadata.title}
            </Link>
            <span className="text-secondary-content/50">
              {" "}
              • {formatDateStr(post.metadata.date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
