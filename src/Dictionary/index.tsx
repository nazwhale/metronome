import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getTermsByLetter,
  getAvailableLetters,
  getAllTags,
  getTermsByTag,
  type DictionaryTerm,
} from "./terms";
import LetterSection from "./components/LetterSection";
import AlphabetNav from "./components/AlphabetNav";
import TagBadge from "./components/TagBadge";
import { BASE_URL } from "../i18n/translations";

const DICTIONARY_TITLE = "Musical Dictionary - Terms & Definitions | tempotick";
const DICTIONARY_DESCRIPTION =
  "Look up musical terms from A to Z: tempo, rhythm, notation, and more. Clear definitions and examples for musicians and students.";

const Dictionary = () => {
  const [searchParams] = useSearchParams();
  const activeTag = searchParams.get("tag");

  const termsByLetter = useMemo(() => getTermsByLetter(), []);
  const availableLetters = useMemo(() => getAvailableLetters(), []);
  const allTags = useMemo(() => getAllTags(), []);
  const filteredTerms = useMemo(
    () => (activeTag ? getTermsByTag(activeTag) : null),
    [activeTag]
  );

  // Convert Map to sorted array for rendering
  const sortedLetters = Array.from(termsByLetter.keys()).sort();

  // Group filtered terms by letter for consistent display
  const filteredTermsByLetter = useMemo(() => {
    if (!filteredTerms) return null;
    const grouped = new Map<string, DictionaryTerm[]>();
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!grouped.has(letter)) {
        grouped.set(letter, []);
      }
      grouped.get(letter)!.push(term);
    });
    return grouped;
  }, [filteredTerms]);

  const canonicalUrl = `${BASE_URL}/dictionary`;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <Helmet>
        <title>{DICTIONARY_TITLE}</title>
        <meta name="description" content={DICTIONARY_DESCRIPTION} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={DICTIONARY_TITLE} />
        <meta property="og:description" content={DICTIONARY_DESCRIPTION} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={DICTIONARY_TITLE} />
        <meta name="twitter:description" content={DICTIONARY_DESCRIPTION} />
      </Helmet>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Musical Dictionary</h1>
        <p className="text-base-content/70">
          A comprehensive glossary of musical terms and definitions. Click on
          any term to learn more.
        </p>
      </header>

      {/* Tag filter section */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-3">
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <TagBadge key={tag} tag={tag} isActive={tag === activeTag} />
          ))}
        </div>
      </section>

      <AlphabetNav
        availableLetters={
          activeTag && filteredTermsByLetter
            ? Array.from(filteredTermsByLetter.keys())
            : availableLetters
        }
      />

      {/* Show filtered results or full dictionary */}
      {activeTag && filteredTermsByLetter ? (
        <div>
          {Array.from(filteredTermsByLetter.keys())
            .sort()
            .map((letter) => (
              <LetterSection
                key={letter}
                letter={letter}
                terms={filteredTermsByLetter.get(letter)!}
              />
            ))}
        </div>
      ) : (
        <div>
          {sortedLetters.map((letter) => (
            <LetterSection
              key={letter}
              letter={letter}
              terms={termsByLetter.get(letter)!}
            />
          ))}
        </div>
      )}

      <footer className="mt-12 py-6 border-t border-base-200 text-center">
        <p className="text-base-content/60 text-sm">
          Can't find a term?{" "}
          <Link to="/articles" className="link link-primary">
            Check our articles
          </Link>{" "}
          for more in-depth explanations.
        </p>
      </footer>
    </div>
  );
};

export default Dictionary;
