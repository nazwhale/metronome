import { Link } from "react-router-dom";

interface TagBadgeProps {
  tag: string;
  isActive?: boolean;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, isActive = false }) => {
  // If active, clicking should clear the filter (go to /dictionary)
  // If inactive, clicking should filter by this tag
  const destination = isActive
    ? "/dictionary"
    : `/dictionary?tag=${encodeURIComponent(tag)}`;

  return (
    <Link
      to={destination}
      className={`
        badge badge-lg transition-colors cursor-pointer
        ${
          isActive
            ? "badge-primary"
            : "badge-outline hover:badge-primary hover:text-primary-content"
        }
      `}
    >
      {tag}
    </Link>
  );
};

export default TagBadge;
