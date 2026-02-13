import { Link } from "react-router-dom";
import { formatDateStr } from "./utils.tsx";

import postMetadata from "../blog-posts/metadata.json";

export interface BlogPostMetadata {
  title: string;
  date: string;
  slug: string;
}

const posts = postMetadata as BlogPostMetadata[];

const Blog = () => {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Articles</h1>
        <p className="text-base-content/70">
          Tips, guides, and insights to help you on your musical journey.
        </p>
      </header>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              className="link link-neutral hover:link-primary"
              to={`/articles/${post.slug}`}
            >
              {post.title}
            </Link>
            <span className="text-base-content/50">
              {" "}
              • {formatDateStr(post.date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
