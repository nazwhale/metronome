/**
 * Time signature definitions for the demo.
 * Based on the standard chart: Simple (Duple/Triple/Quadruple) and Compound (Duple/Triple/Quadruple).
 */

const SIXTEENTH_LABELS = ["1", "e", "+", "a"] as const;

/** Musical note symbols for beat-unit display (♩ = 72, etc.) */
export const BEAT_SYMBOLS = {
  quarter: "♩",
  half: "\u{1D15D}", // 𝅗𝅥 half note
  eighth: "♪",
  dottedQuarter: "♩.",
  dottedHalf: "\u{1D15D}.", // dotted half
} as const;

export type TimeSignatureConfig = {
  /** Display label e.g. "2/4" */
  label: string;
  /** Category from chart e.g. "Simple Duple" */
  category: string;
  /** Optional comment e.g. "Common Time" */
  comment?: string;
  /** Short line under subheader: e.g. "Beat = quarter note" or "Beat = half note (Alla breve)" */
  beatUnitLabel: string;
  /** Symbol for notation display: e.g. "♩" → "♩ = 72" */
  beatUnitSymbol: string;
  /** "simple" = beat divides in 2 (1 e + a); "compound" = beat divides in 3 (1 2 3) */
  type: "simple" | "compound";
  /** Number of main beats per bar (2, 3, or 4) */
  mainBeats: number;
  /** Subdivisions per main beat: 4 for simple (1 e + a), 3 for compound */
  subdivisionsPerBeat: 4 | 3;
  /** Which tick indices get a click (0-based). First is strong (accent), rest are regular. */
  clickAtTicks: number[];
  /** Three verified examples of pieces/songs in this time signature. */
  songExamples: [string, string, string];
  /** Optional explainer: question mark icon reveals title + content (e.g. "Why two main beats per bar?"). */
  explainer?: { title: string; content: string };
};

function simpleLabels(mainBeats: number): string[] {
  const out: string[] = [];
  for (let b = 0; b < mainBeats; b++) {
    const beatNum = b + 1;
    for (let i = 0; i < 4; i++) {
      out.push(i === 0 ? String(beatNum) : SIXTEENTH_LABELS[i]);
    }
  }
  return out;
}

function compoundLabels(mainBeats: number): string[] {
  const out: string[] = [];
  for (let b = 0; b < mainBeats; b++) {
    for (let i = 0; i < 3; i++) {
      out.push(String(b * 3 + i + 1));
    }
  }
  return out;
}

/** Tick indices where we play a click; first main beat (index 0) is accent. */
function simpleClickTicks(mainBeats: number): number[] {
  return Array.from({ length: mainBeats }, (_, i) => i * 4);
}

function compoundClickTicks(mainBeats: number): number[] {
  return Array.from({ length: mainBeats }, (_, i) => i * 3);
}

const { quarter, half, eighth, dottedQuarter, dottedHalf } = BEAT_SYMBOLS;

export const TIME_SIGNATURE_CONFIGS: TimeSignatureConfig[] = [
  // Simple Duple
  {
    label: "2/4",
    category: "Simple Duple",
    comment: "Two main beats per bar",
    beatUnitLabel: "Beat = quarter note",
    beatUnitSymbol: quarter,
    type: "simple",
    mainBeats: 2,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(2),
    songExamples: ["Flight of the Bumblebee (Rimsky-Korsakov)", "Turkish March (Mozart)", "Can Can (Offenbach)"],
  },
  {
    label: "2/2",
    category: "Simple Duple",
    comment: "Alla Breve — 1st and 2nd level sub-beats beamed to show two beats per bar",
    beatUnitLabel: "Beat = half note (Alla breve)",
    beatUnitSymbol: half,
    type: "simple",
    mainBeats: 2,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(2),
    songExamples: ["Symphony No. 4, 1st mov. (Brahms)", "Piano Sonata No. 8 Pathétique (Beethoven)", "Many Baroque chorales (Bach)"],
  },
  // Simple Triple
  {
    label: "3/8",
    category: "Simple Triple",
    comment: "Three main beats per bar",
    beatUnitLabel: "Beat = eighth note",
    beatUnitSymbol: eighth,
    type: "simple",
    mainBeats: 3,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(3),
    songExamples: ["The Sorcerer's Apprentice (Dukas)", "Arabian Dance from Nutcracker (Tchaikovsky)", "Sonata No. 17 Tempest, 3rd mov. (Beethoven)"],
  },
  {
    label: "3/4",
    category: "Simple Triple",
    comment: "1st level sub-beats beamed in sixes; 2nd level show three beats per bar",
    beatUnitLabel: "Beat = quarter note",
    beatUnitSymbol: quarter,
    type: "simple",
    mainBeats: 3,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(3),
    songExamples: ["Piano Man (Billy Joel)", "Can't Help Falling in Love (Elvis Presley)", "We Can Work It Out (The Beatles)"],
  },
  {
    label: "3/2",
    category: "Simple Triple",
    comment: "Three half-note beats per bar",
    beatUnitLabel: "Beat = half note",
    beatUnitSymbol: half,
    type: "simple",
    mainBeats: 3,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(3),
    songExamples: ["Lascia ch'io pianga from Rinaldo (Handel)", "When I am Laid in Earth from Dido and Aeneas (Purcell)", "Prelude in E♭, WTC Book I (Bach)"],
  },
  // Simple Quadruple
  {
    label: "4/8",
    category: "Simple Quadruple",
    comment: "Four main beats per bar",
    beatUnitLabel: "Beat = eighth note",
    beatUnitSymbol: eighth,
    type: "simple",
    mainBeats: 4,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(4),
    songExamples: ["Wenn mein Schatz Hochzeit macht from Songs of a Wayfarer (Mahler)", "Mayo Nafwa (Zambian traditional)", "Some piano and vocal works (Wesley, Joplin in certain editions)"],
  },
  {
    label: "4/4",
    category: "Simple Quadruple",
    comment: "Common Time",
    beatUnitLabel: "Beat = quarter note",
    beatUnitSymbol: quarter,
    type: "simple",
    mainBeats: 4,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(4),
    songExamples: ["We Will Rock You (Queen)", "Seven Nation Army (The White Stripes)", "Rolling in the Deep (Adele)"],
  },
  {
    label: "4/2",
    category: "Simple Quadruple",
    comment: "Four half-note beats per bar",
    beatUnitLabel: "Beat = half note",
    beatUnitSymbol: half,
    type: "simple",
    mainBeats: 4,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(4),
    songExamples: ["Impromptu No. 3 (Schubert)", "Renaissance motets (Josquin des Prés)", "St Matthew Passion chorales (Bach)"],
  },
  // Simple Quintuple
  {
    label: "5/4",
    category: "Simple Quintuple",
    comment: "Five quarter-note beats per bar",
    beatUnitLabel: "Beat = quarter note",
    beatUnitSymbol: quarter,
    type: "simple",
    mainBeats: 5,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(5),
    songExamples: ["Take Five (Dave Brubeck)", "Mars from The Planets (Holst)", "Living in the Past (Jethro Tull)"],
  },
  {
    label: "5/8",
    category: "Simple Quintuple",
    comment: "Five eighth-note beats per bar (often grouped 3+2 or 2+3)",
    beatUnitLabel: "Beat = eighth note",
    beatUnitSymbol: eighth,
    type: "simple",
    mainBeats: 5,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(5),
    songExamples: ["Sonatine, 3rd mov. (Ravel)", "Piano works (Hindemith)", "Balkan folk music (e.g. 3+2, 2+3)"],
  },
  // Simple Septuple
  {
    label: "7/4",
    category: "Simple Septuple",
    comment: "Seven quarter-note beats per bar",
    beatUnitLabel: "Beat = quarter note",
    beatUnitSymbol: quarter,
    type: "simple",
    mainBeats: 7,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(7),
    songExamples: ["Money (Pink Floyd)", "Solsbury Hill (Peter Gabriel)", "Times Like These (Foo Fighters)"],
  },
  {
    label: "7/8",
    category: "Simple Septuple",
    comment: "Seven eighth-note beats per bar (often grouped 2+2+3 or 3+2+2)",
    beatUnitLabel: "Beat = eighth note",
    beatUnitSymbol: eighth,
    type: "simple",
    mainBeats: 7,
    subdivisionsPerBeat: 4,
    clickAtTicks: simpleClickTicks(7),
    songExamples: ["The Ocean (Led Zeppelin)", "Schism (Tool)", "Paranoid Android (Radiohead)"],
  },
  // Compound Duple
  {
    label: "6/8",
    category: "Compound Duple",
    comment: "In compound time the main beats are dotted",
    beatUnitLabel: "Beat = dotted quarter note",
    beatUnitSymbol: dottedQuarter,
    type: "compound",
    mainBeats: 2,
    subdivisionsPerBeat: 3,
    clickAtTicks: compoundClickTicks(2),
    songExamples: ["House of the Rising Sun (The Animals)", "Norwegian Wood (The Beatles)", "Nothing Else Matters (Metallica)"],
    explainer: {
      title: "Why two main beats per bar?",
      content:
        "In compound time, the top number tells you how many subdivision notes (eighth notes in 6/8) there are per bar. The main beats are grouped in threes, so you divide by 3 to get the number of beats: 6 ÷ 3 = 2. So 6/8 has two main beats, each worth a dotted quarter (three eighths). That’s why you feel “1-2-3, 4-5-6” as two beats, not six.",
    },
  },
  {
    label: "6/4",
    category: "Compound Duple",
    comment: "Two dotted-half beats per bar",
    beatUnitLabel: "Beat = dotted half note",
    beatUnitSymbol: dottedHalf,
    type: "compound",
    mainBeats: 2,
    subdivisionsPerBeat: 3,
    clickAtTicks: compoundClickTicks(2),
    songExamples: ["Nocturne Op. 9 No. 1 (Chopin)", "E lucevan le stelle from Tosca (Puccini)", "Uranus from The Planets (Holst)"],
    explainer: {
      title: "Why two main beats per bar?",
      content:
        "Same idea as 6/8: in compound time the top number (6) is the number of quarter notes per bar, grouped in threes. 6 ÷ 3 = 2 main beats, each a dotted half note. So you feel two big beats per bar, each dividing into three.",
    },
  },
  // Compound Triple
  {
    label: "9/8",
    category: "Compound Triple",
    comment: "1st level sub-beat beamed in threes; 2nd level in sixes",
    beatUnitLabel: "Beat = dotted quarter note",
    beatUnitSymbol: dottedQuarter,
    type: "compound",
    mainBeats: 3,
    subdivisionsPerBeat: 3,
    clickAtTicks: compoundClickTicks(3),
    songExamples: ["Blue Rondo à la Turk (Dave Brubeck)", "The Rocky Road to Dublin (trad.)", "Beautiful Dreamer (Stephen Foster)"],
  },
  {
    label: "9/4",
    category: "Compound Triple",
    comment: "Three dotted-half beats per bar",
    beatUnitLabel: "Beat = dotted half note",
    beatUnitSymbol: dottedHalf,
    type: "compound",
    mainBeats: 3,
    subdivisionsPerBeat: 3,
    clickAtTicks: compoundClickTicks(3),
    songExamples: ["Pieds-en-l'air from Capriol Suite (Warlock)", "Chorale from Organ Symphony No. 3 (Saint-Saëns)", "The Guitar Lesson (Étienne de Lavaulx)"],
  },
  // Compound Quadruple
  {
    label: "12/8",
    category: "Compound Quadruple",
    comment: "Four dotted-quarter beats per bar",
    beatUnitLabel: "Beat = dotted quarter note",
    beatUnitSymbol: dottedQuarter,
    type: "compound",
    mainBeats: 4,
    subdivisionsPerBeat: 3,
    clickAtTicks: compoundClickTicks(4),
    songExamples: ["Unchained Melody (The Righteous Brothers)", "Since I've Been Loving You (Led Zeppelin)", "Everybody Wants to Rule the World (Tears for Fears)"],
  },
  {
    label: "12/4",
    category: "Compound Quadruple",
    comment: "Four dotted-half beats per bar",
    beatUnitLabel: "Beat = dotted half note",
    beatUnitSymbol: dottedHalf,
    type: "compound",
    mainBeats: 4,
    subdivisionsPerBeat: 3,
    clickAtTicks: compoundClickTicks(4),
    songExamples: ["Rare; same feel as 12/8 at slower tempo", "Some 20th-century orchestral passages", "Extended contemporary and film score cues"],
  },
];

export function getSubdivisionLabels(config: TimeSignatureConfig): string[] {
  return config.type === "simple"
    ? simpleLabels(config.mainBeats)
    : compoundLabels(config.mainBeats);
}

export function getTicksPerBar(config: TimeSignatureConfig): number {
  return config.mainBeats * config.subdivisionsPerBeat;
}
