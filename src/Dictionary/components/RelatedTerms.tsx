import { Link } from "react-router-dom";
import { dictionaryTerms } from "../terms";

interface RelatedTermsProps {
  terms: string[];
}

const RelatedTerms: React.FC<RelatedTermsProps> = ({ terms }) => {
  if (!terms || terms.length === 0) return null;

  // Filter to only terms that exist in the dictionary
  const existingTerms = terms
    .map((termName) => {
      const found = dictionaryTerms.find(
        (t) => t.term.toLowerCase() === termName.toLowerCase()
      );
      return found ? { name: termName, slug: found.slug } : null;
    })
    .filter((t): t is { name: string; slug: string } => t !== null);

  // Don't render the section if no related terms exist in the dictionary
  if (existingTerms.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">
        Related Terms
      </h3>
      <div className="flex flex-wrap gap-2">
        {existingTerms.map(({ name, slug }) => (
          <Link
            key={slug}
            to={`/dictionary/${slug}`}
            className="badge badge-outline badge-primary hover:badge-primary hover:text-primary-content transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedTerms;
