import type { DictionaryTerm } from "../terms";
import DictionaryItem from "./DictionaryItem";

interface LetterSectionProps {
  letter: string;
  terms: DictionaryTerm[];
}

const LetterSection: React.FC<LetterSectionProps> = ({ letter, terms }) => {
  return (
    <section id={`letter-${letter}`} className="mb-8 scroll-mt-20">
      <div className="sticky top-0 bg-base-100 py-2 z-10 border-b-2 border-primary">
        <h2 className="text-3xl font-bold text-primary">{letter}</h2>
      </div>
      <ul className="mt-4">
        {terms.map((term) => (
          <DictionaryItem key={term.slug} term={term} />
        ))}
      </ul>
    </section>
  );
};

export default LetterSection;
