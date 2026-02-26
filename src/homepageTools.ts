/**
 * Tool directory for the homepage (SEO tools hub).
 * Used for the tool grid, "Choose your path" clusters, and ItemList/SoftwareApplication schema.
 */

export interface HomepageTool {
  path: string;
  name: string;
  /** One sentence benefit (not features). */
  benefit: string;
  /** 2–4 feature chips, e.g. "Tap tempo", "Loop points". */
  chips: string[];
  /** Show "Most popular" badge (e.g. Online Metronome). */
  featured?: boolean;
  /** For schema: application category. */
  applicationCategory: string;
}

/** Tools shown in the main grid (order: featured first, then by category). */
export const HOMEPAGE_TOOLS: HomepageTool[] = [
  {
    path: "/online-metronome",
    name: "Online Metronome",
    benefit: "Keep steady time and lock in your internal pulse with a simple, reliable click.",
    chips: ["Tap tempo", "Time signatures", "Beat accents", "Mute bars"],
    featured: true,
    applicationCategory: "MusicApplication",
  },
  {
    path: "/speed-trainer-metronome",
    name: "Speed Trainer Metronome",
    benefit: "Gradually increase tempo bar-by-bar so you build speed without losing accuracy.",
    chips: ["Auto ramp-up", "Custom bars", "Start & target BPM"],
    applicationCategory: "MusicApplication",
  },
  {
    path: "/youtube-looper",
    name: "YouTube Looper",
    benefit: "Loop any section of a YouTube video to transcribe, learn by ear, or drill a phrase.",
    chips: ["Set start & end", "Slow down", "Loop A–B"],
    applicationCategory: "MusicApplication",
  },
  {
    path: "/guitar-triad-trainer",
    name: "Guitar Triad Trainer",
    benefit: "Learn major, minor, and seventh triads on the fretboard with instant feedback.",
    chips: ["Major, minor, 7th", "Flashcards", "Stats"],
    applicationCategory: "EducationalApplication",
  },
  {
    path: "/dictionary",
    name: "Musical Dictionary",
    benefit: "Look up tempo terms, rhythm, and notation so you can read and talk about music clearly.",
    chips: ["A–Z terms", "Definitions", "Examples"],
    applicationCategory: "ReferenceApplication",
  },
  {
    path: "/circle-of-fifths-metronome",
    name: "Circle of Fifths Metronome",
    benefit: "Practice with a metronome that cycles through keys—great for theory and key awareness.",
    chips: ["Key cycle", "Metronome click", "Visual circle"],
    applicationCategory: "MusicApplication",
  },
];

/** Clusters for "Choose your path" (internal linking + UX). */
export const TOOL_CLUSTERS: { title: string; description?: string; paths: { path: string; name: string }[] }[] = [
  {
    title: "Timing & rhythm",
    description: "Metronomes and tempo tools",
    paths: [
      { path: "/online-metronome", name: "Online Metronome" },
      { path: "/speed-trainer-metronome", name: "Speed Trainer" },
      { path: "/circle-of-fifths-metronome", name: "Circle of Fifths metronome" },
      { path: "/time-signature-examples", name: "Time signature examples" },
    ],
  },
  {
    title: "Guitar practice",
    paths: [
      { path: "/guitar-triad-trainer", name: "Triad Trainer" },
      { path: "/prompts-for-guitar", name: "Prompts for guitarists" },
    ],
  },
  {
    title: "Theory & vocabulary",
    paths: [
      { path: "/dictionary", name: "Musical Dictionary" },
    ],
  },
  {
    title: "Ear training",
    paths: [
      { path: "/chord-progression-trainer", name: "Chord Progression Trainer" },
      { path: "/melodic-dictation-trainer", name: "Melodic Dictation Trainer" },
    ],
  },
  {
    title: "Practice with recordings",
    paths: [
      { path: "/youtube-looper", name: "YouTube Looper" },
    ],
  },
];
