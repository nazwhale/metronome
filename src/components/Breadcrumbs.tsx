import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HOMEPAGE_TOOLS } from "../homepageTools";
import { TOOL_DISPLAY_NAMES } from "../toolDisplayNames";
import { BASE_URL } from "../i18n/translations";

export type BreadcrumbItem = { label: string; path?: string };

/** Display name for a path: prefer HOMEPAGE_TOOLS (title case), else TOOL_DISPLAY_NAMES, else format path. */
const TOOL_NAMES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  HOMEPAGE_TOOLS.forEach((t) => {
    map[t.path] = t.name;
  });
  Object.entries(TOOL_DISPLAY_NAMES).forEach(([path, name]) => {
    if (!map[path]) map[path] = name;
  });
  return map;
})();

function getToolName(path: string): string {
  return TOOL_NAMES[path] ?? path.slice(1).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format slug for display: "circle-of-fifths" → "Circle of fifths". */
function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Derive breadcrumb items from pathname. Returns null for home, embed, or unknown routes.
 * - Tool page (e.g. /online-metronome): All tools → Tool name
 * - Variant (e.g. /online-metronome/80-bpm): All tools → Parent tool → Variant label
 */
export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] | null {
  if (pathname === "/" || pathname.startsWith("/embed")) return null;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const allTools: BreadcrumbItem = { label: "All tools", path: "/" };

  // Language-prefixed metronome routes: /fi/metronomi and /es/metronomo (language segment is not a route by itself)
  if (pathname === "/fi/metronomi" || pathname === "/es/metronomo") {
    return [allTools, { label: getToolName(pathname) }];
  }
  const langMetroMatch = pathname.match(/^\/(fi\/metronomi|es\/metronomo)\/(\d+)-bpm$/);
  if (langMetroMatch) {
    const parentPath = `/${langMetroMatch[1]}`;
    const bpm = langMetroMatch[2];
    return [
      allTools,
      { label: getToolName(parentPath), path: parentPath },
      { label: `${bpm} BPM` },
    ];
  }

  if (segments.length === 1) {
    const path = `/${segments[0]}`;
    return [allTools, { label: getToolName(path) }];
  }

  // Two or more segments: parent path + variant (e.g. /online-metronome/80-bpm)
  const parentPath = `/${segments.slice(0, -1).join("/")}`;
  const lastSegment = segments[segments.length - 1];

  let variantLabel: string;
  if (lastSegment === "difference-between-34-and-68") {
    variantLabel = "Difference between 3/4 and 6/8";
  } else if (lastSegment === "difference-between-32-and-64") {
    variantLabel = "Difference between 3/2 and 6/4";
  } else if (lastSegment.match(/^\d+-bpm$/)) {
    const bpm = lastSegment.replace(/-bpm$/, "");
    variantLabel = `${bpm} BPM`;
  } else {
    variantLabel = formatSlug(lastSegment);
  }

  return [
    allTools,
    { label: getToolName(parentPath), path: parentPath },
    { label: variantLabel },
  ];
}

/** Current page label for nav (e.g. "Online Metronome", "80 BPM"). Returns null for home or embed. */
export function getCurrentPageLabel(pathname: string): string | null {
  const items = getBreadcrumbItems(pathname);
  if (!items || items.length === 0) return null;
  return items[items.length - 1].label;
}

type Props = {
  /** Optional override items (e.g. when page has a specific title for the last segment). */
  items?: BreadcrumbItem[] | null;
};

/**
 * SEO-friendly breadcrumbs: nav with links + BreadcrumbList JSON-LD.
 * If items is not passed, derives from current pathname.
 */
export default function Breadcrumbs({ items: itemsOverride }: Props) {
  const { pathname } = useLocation();
  const items = itemsOverride ?? getBreadcrumbItems(pathname);

  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.path && { item: `${BASE_URL}${item.path}` }),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-base-content/70">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden className="select-none">/</span>}
              {item.path ? (
                <Link to={item.path} className="link link-hover text-base-content/70 hover:text-base-content/90">
                  {item.label}
                </Link>
              ) : (
                <span className="text-base-content/80" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
