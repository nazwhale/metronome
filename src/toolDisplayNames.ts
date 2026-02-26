/**
 * Display names for tool routes. Used by Breadcrumbs to avoid circular dependency
 * (Breadcrumbs → All would pull in All → TimeSignatureExamples → Breadcrumbs).
 * Keep in sync with the routes in All.tsx.
 */
export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  "/online-metronome": "basic metronome",
  "/circle-of-fifths-metronome": "circle of fifths metronome",
  "/speed-trainer-metronome": "speed trainer metronome",
  "/prompts-for-guitar": "prompts for guitarists",
  "/youtube-looper": "youtube looper",
  "/chord-progression-trainer": "chord progression trainer",
  "/melodic-dictation-trainer": "melodic dictation trainer",
  "/guitar-triad-trainer": "guitar triad trainer",
  "/articles": "articles",
  "/time-signature-examples": "time signature examples",
  "/es/metronomo": "metronomo",
  "/fi/metronomi": "metronomi",
};
