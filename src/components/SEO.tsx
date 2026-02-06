import { Helmet } from "react-helmet-async";
import { Language, TranslatedPage, getHreflangUrls, BASE_URL } from "../i18n/translations";

export type HreflangUrls = {
  en: string;
  es: string;
  fi: string;
  xDefault: string;
};

type SEOProps = {
  title: string;
  description: string;
  lang: Language;
  canonicalPath: string;
  translatedPage?: TranslatedPage; // If this page has translations
  hreflangUrls?: HreflangUrls; // Override when e.g. BPM-specific pages
};

/**
 * SEO component that handles:
 * - Page title and description
 * - Language-specific <html lang="...">
 * - hreflang tags for translated pages
 * - x-default hreflang for default language
 * - Canonical URL
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  lang,
  canonicalPath,
  translatedPage,
  hreflangUrls: hreflangUrlsOverride,
}) => {
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const hreflangUrls = hreflangUrlsOverride ?? (translatedPage ? getHreflangUrls(translatedPage) : null);

  return (
    <Helmet>
      {/* Set the HTML language attribute */}
      <html lang={lang} />

      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang tags for pages with translations */}
      {hreflangUrls && (
        <>
          <link rel="alternate" hrefLang="en" href={hreflangUrls.en} />
          <link rel="alternate" hrefLang="es" href={hreflangUrls.es} />
          <link rel="alternate" hrefLang="fi" href={hreflangUrls.fi} />
          <link rel="alternate" hrefLang="x-default" href={hreflangUrls.xDefault} />
        </>
      )}
    </Helmet>
  );
};

export default SEO;
