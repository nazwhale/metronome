import { Helmet } from "react-helmet-async";

/**
 * Minimal WebApplication (schema.org) JSON-LD for tools that run in the browser.
 * Use for pages like the online metronome or guitar triad trainer so search can
 * better understand and display app details. No ratings or reviews.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/software-app
 * @see https://schema.org/WebApplication
 */
export interface WebApplicationSchemaProps {
  name: string;
  url: string;
  description: string;
  /** e.g. "MusicApplication", "EducationalApplication" */
  applicationCategory: string;
}

const WebApplicationSchema: React.FC<WebApplicationSchemaProps> = ({
  name,
  url,
  description,
  applicationCategory,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory,
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default WebApplicationSchema;
