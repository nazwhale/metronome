import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getTermBySlug } from "./terms";
import RelatedTerms from "./components/RelatedTerms";
import TagBadge from "./components/TagBadge";
import { BASE_URL } from "../i18n/translations";

const SITE_NAME = "tempotick";

function metaDescription(shortDefinition: string, maxLength = 155): string {
  const trimmed = shortDefinition.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength - 3).trim() + "...";
}

const TermPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const term = slug ? getTermBySlug(slug) : undefined;

  if (!term) {
    return (
      <div className="max-w-3xl mx-auto px-4 text-center py-12">
        <Helmet>
          <title>Term Not Found | Musical Dictionary | {SITE_NAME}</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-4">Term Not Found</h1>
        <p className="text-base-content/70 mb-6">
          Sorry, we couldn't find that term in our dictionary.
        </p>
        <Link to="/dictionary" className="btn btn-primary">
          Back to Dictionary
        </Link>
      </div>
    );
  }

  const pageTitle = `${term.term} - Musical Dictionary | ${SITE_NAME}`;
  const description = metaDescription(term.shortDefinition);
  const canonicalUrl = `${BASE_URL}/dictionary/${term.slug}`;

  const definedTermJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.shortDefinition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Musical Dictionary",
      url: `${BASE_URL}/dictionary`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Musical Dictionary", item: `${BASE_URL}/dictionary` },
      { "@type": "ListItem", position: 3, name: term.term, item: canonicalUrl },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify(definedTermJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>
      <nav className="mb-6">
        <Link
          to="/dictionary"
          className="link link-hover text-base-content/60 inline-flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dictionary
        </Link>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{term.term}</h1>
          <p className="text-xl text-base-content/80">{term.shortDefinition}</p>
        </header>

        <section className="prose prose-lg max-w-none">
          <p>{term.fullDefinition}</p>
        </section>

        {term.examples && term.examples.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Examples</h2>
            <ul className="space-y-2">
              {term.examples.map((example, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-base-content/80"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {term.tags && term.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {term.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
        )}

        {term.relatedTerms && <RelatedTerms terms={term.relatedTerms} />}
      </article>
    </div>
  );
};

export default TermPage;
