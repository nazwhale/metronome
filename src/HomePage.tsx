import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEO from "./components/SEO";
import QandA, { QAItem } from "./components/QandA";
import { BASE_URL } from "./i18n/translations";
import { HOMEPAGE_TOOLS, TOOL_CLUSTERS } from "./homepageTools";

/** Decorative icons for tool cards (inline SVG, aria-hidden for a11y). */
const TOOL_ICONS: Record<string, React.ReactNode> = {
  "/online-metronome": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  "/speed-trainer-metronome": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  "/youtube-looper": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  "/guitar-triad-trainer": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5.5-9-5.5-9 5.5 9 5.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  "/dictionary": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "/chord-chart-converter": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  "/circle-of-fifths-metronome": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "/prompts-for-guitar": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  "/chord-progression-trainer": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  ),
  "/melodic-dictation-trainer": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  ),
  "/time-signature-examples": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
};

const HOMEPAGE_TITLE = "Tempotick: Free Music Practice Tools (Metronome, Looper, Ear Training)";
const HOMEPAGE_DESCRIPTION =
  "Free music practice tools for musicians: online metronome, YouTube looper, guitar triad trainer, speed trainer, and musical dictionary. Fast, simple, ad-free.";

/** Plain-text answer for FAQ schema; display uses the React node. */
const FAQ_ITEMS: (QAItem & { answerText: string })[] = [
  {
    question: "Are these tools free?",
    answerText: "Yes. All tools on Tempotick are free to use. There are no sign-up walls, subscriptions, or ads.",
    answer: <p>Yes. All tools on Tempotick are free to use. There are no sign-up walls, subscriptions, or ads.</p>,
  },
  {
    question: "Do I need to sign up?",
    answerText: "No. You can use every tool without creating an account or signing in.",
    answer: <p>No. You can use every tool without creating an account or signing in.</p>,
  },
  {
    question: "Which tool should I use to improve timing?",
    answerText: "Use the Online Metronome for steady tempo practice. For building speed gradually, try the Speed Trainer Metronome.",
    answer: (
      <p>
        Use the <Link to="/online-metronome" className="link link-primary">Online Metronome</Link> for steady tempo practice.
        For building speed gradually, try the <Link to="/speed-trainer-metronome" className="link link-primary">Speed Trainer Metronome</Link>.
      </p>
    ),
  },
  {
    question: "Which tool helps with ear training or chord knowledge?",
    answerText: "The Guitar Triad Trainer drills triads on the fretboard. For theory and vocabulary, use the Musical Dictionary.",
    answer: (
      <p>
        The <Link to="/guitar-triad-trainer" className="link link-primary">Guitar Triad Trainer</Link> drills triads on the fretboard.
        For theory and vocabulary, use the <Link to="/dictionary" className="link link-primary">Musical Dictionary</Link>.
      </p>
    ),
  },
  {
    question: "Do the tools work on mobile?",
    answerText: "Yes. All tools are web-based and work in your phone or tablet browser. No app download required.",
    answer: <p>Yes. All tools are web-based and work in your phone or tablet browser. No app download required.</p>,
  },
];

/** Build FAQPage schema for the homepage FAQ. */
function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText,
      },
    })),
  };
}

/** ItemList + SoftwareApplication entries for the tool directory. */
function getToolDirectorySchema() {
  const itemListElement = HOMEPAGE_TOOLS.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: tool.name,
      url: `${BASE_URL}${tool.path}`,
      applicationCategory: tool.applicationCategory,
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Tempotick music practice tools",
        description: "Free online tools for musicians: metronome, looper, ear training, triads, dictionary.",
        numberOfItems: HOMEPAGE_TOOLS.length,
        itemListElement,
      },
    ],
  };
}

const HomePage: React.FC = () => {
  const faqSchema = getFAQSchema();
  const toolSchema = getToolDirectorySchema();

  return (
    <>
      <SEO
        title={HOMEPAGE_TITLE}
        description={HOMEPAGE_DESCRIPTION}
        lang="en"
        canonicalPath="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(toolSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 text-left">
        {/* Hero */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Free music practice tools for musicians
          </h1>
          <p className="text-lg text-base-content/80">
            Metronome, YouTube looper, ear training, triads, and a musical dictionary. Fast, simple, ad-free.
          </p>
        </header>

        {/* Tool grid */}
        <section className="mb-16" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="sr-only">
            Music practice tools
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOMEPAGE_TOOLS.map((tool) => (
              <article
                key={tool.path}
                className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow h-full"
              >
                <Link
                  to={tool.path}
                  className="card-body flex flex-col h-full cursor-pointer no-underline text-inherit hover:no-underline"
                >
                  <div className="">
                    <h3 className="card-title text-lg flex items-start gap-2 min-w-0 flex-1 flex-nowrap">
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        {TOOL_ICONS[tool.path] && (
                          <span className="text-primary shrink-0 inline-flex items-center" aria-hidden="true">
                            {TOOL_ICONS[tool.path]}
                          </span>
                        )}
                        <span className="break-words min-w-0">{tool.name}</span>
                      </div>
                    </h3>
                  </div>
                  <p className="text-sm text-base-content/80">{tool.benefit}</p>
                  <ul className="space-y-1.5 mt-2 flex-1">
                    {tool.chips.map((chip) => (
                      <li key={chip} className="flex items-center gap-2 text-sm text-base-content/90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{chip}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions mt-4 w-full">
                    <span className="btn btn-primary btn-sm w-full justify-center">
                      Open
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Choose your path */}
        <section className="mb-16" aria-labelledby="path-heading">
          <h2 id="path-heading" className="text-2xl font-bold mb-4">
            Choose your path
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {TOOL_CLUSTERS.map((cluster) => (
              <div key={cluster.title} className="card bg-base-200 shadow">
                <div className="card-body">
                  <h3 className="font-semibold text-lg">{cluster.title}</h3>
                  {cluster.description && (
                    <p className="text-sm text-base-content/70">{cluster.description}</p>
                  )}
                  <ul className="list-none p-0 mt-2 space-y-1">
                    {cluster.paths.map(({ path, name }) => (
                      <li key={path}>
                        <Link to={path} className="link link-primary inline-flex items-center gap-2">
                          {TOOL_ICONS[path] && (
                            <span className="text-primary shrink-0 inline-flex items-center" aria-hidden="true">
                              {TOOL_ICONS[path]}
                            </span>
                          )}
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What is Tempotick? */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-3">What is Tempotick?</h2>
          <p className="text-base-content/90">
            Tempotick is a collection of free, browser-based tools for musicians. We focus on timing, rhythm,
            ear training, and vocabulary so you can practice without juggling tabs or downloads. Everything
            runs in your browser and works on desktop and mobile.
          </p>
        </section>

        {/* Tools, not tabs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-3">Tools, not tabs</h2>
          <ul className="list-disc pl-6 space-y-1 text-base-content/90">
            <li>Fast to load — no heavy apps or sign-ups</li>
            <li>Distraction-free — no ads, no clutter</li>
            <li>Works on mobile — use your phone or tablet in the practice room</li>
            <li>One place — metronome, looper, triads, and dictionary in one site</li>
          </ul>
        </section>

        {/* Popular practice workflows */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-3">Popular practice workflows</h2>
          <ul className="list-disc pl-6 space-y-2 text-base-content/90">
            <li>
              Loop a tricky bar → slow it down → add metronome accents → increase BPM. (Use{" "}
              <Link to="/youtube-looper" className="link link-primary">YouTube Looper</Link> and{" "}
              <Link to="/online-metronome" className="link link-primary">Online Metronome</Link>.)
            </li>
            <li>
              Triads drill → metronome at 60 → speed trainer to 100. (Use{" "}
              <Link to="/guitar-triad-trainer" className="link link-primary">Triad Trainer</Link>,{" "}
              <Link to="/online-metronome" className="link link-primary">Metronome</Link>, and{" "}
              <Link to="/speed-trainer-metronome" className="link link-primary">Speed Trainer</Link>.)
            </li>
            <li>
              Look up a tempo term in the <Link to="/dictionary" className="link link-primary">Dictionary</Link>,
              then set the metronome to that BPM and play.
            </li>
            <li>
              Use the Circle of Fifths metronome to cycle keys while you play scales or chord changes.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <QandA items={FAQ_ITEMS} title={""} />
        </section>
      </div>
    </>
  );
};

export default HomePage;
