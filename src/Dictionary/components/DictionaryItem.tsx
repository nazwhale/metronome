import { Link } from "react-router-dom";
import type { DictionaryTerm } from "../terms";

interface DictionaryItemProps {
  term: DictionaryTerm;
}

const DictionaryItem: React.FC<DictionaryItemProps> = ({ term }) => {
  return (
    <li className="py-3 border-b border-base-200 last:border-b-0">
      <Link
        to={`/dictionary/${term.slug}`}
        className="group block hover:bg-base-200 -mx-3 px-3 py-2 rounded-lg transition-colors"
      >
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
          {term.term}
        </h3>
        <p className="text-base-content/70 text-sm mt-1">
          {term.shortDefinition}
        </p>
      </Link>
    </li>
  );
};

export default DictionaryItem;
