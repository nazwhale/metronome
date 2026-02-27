/**
 * Guitar Triad Trainer data: keys, positions (inversions), string sets.
 * Prompts: string set + bass-note chord tone + nearest playable voicing.
 * Standard tuning semitones from C=0: D=2, G=7, B=11, e=4.
 */

export const KEYS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type Key = (typeof KEYS)[number];

/**
 * Position = which chord tone is in the bass (nearest playable voicing).
 * root = root position (1 in bass), 1st = first inversion (3 in bass), 2nd = second inversion (5 in bass).
 */
export const POSITIONS = ["root", "1st", "2nd"] as const;

export type Position = (typeof POSITIONS)[number];

/** Stage 1 = G-B-e, Stage 2 = D-G-B, Stage 3 = mixed (each card uses G-B-e or D-G-B). */
export type Stage = 1 | 2 | 3;

/** String set stage (1 or 2). Stage 3 uses this per-card. */
export type StringSetStage = 1 | 2;

/** String set: open note semitones (C=0). Index 0 = lowest string in set, 2 = highest. */
const STRING_OPEN_BY_STAGE: Record<StringSetStage, number[]> = {
  1: [7, 11, 4],   // G, B, e
  2: [2, 7, 11],   // D, G, B
};

/** Human-readable string set label per stage (e.g. for clues). Stage 3 is generic; per-card label comes from StringSetStage. */
export const STRING_SET_LABEL: Record<Stage, string> = {
  1: "G–B–e",
  2: "D–G–B",
  3: "G–B–e & D–G–B (mixed)",
};

/** String labels by string-set stage for diagrams: [lowest, middle, highest] = index 0, 1, 2. */
export const STRING_LABELS_BY_STAGE: Record<StringSetStage, [string, string, string]> = {
  1: ["G", "B", "e"],
  2: ["D", "G", "B"],
};

/** Full 6-string tab labels for "Play in this range" (high to low: e, B, G, D, A, E). Triad strings show name; others show "x". */
export const TAB_STRING_LABELS_BY_STAGE: Record<StringSetStage, readonly [string, string, string, string, string, string]> = {
  1: ["e", "B", "G", "x", "x", "x"],
  2: ["x", "B", "G", "D", "x", "x"],
};

const KEY_TO_SEMITONE: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

/** [role at string 0, 1, 2] where 0=root, 1=3rd, 2=5th. One voicing per inversion. */
const POSITION_ROLES: Record<Position, [number, number, number]> = {
  root: [0, 1, 2], // 1 on lowest string, 3 on middle, 5 on highest
  "1st": [1, 2, 0], // 3, 5, 1
  "2nd": [2, 0, 1], // 5, 1, 3
};

export interface TriadPosition {
  stringIndex: number;
  fret: number;
  degree: 1 | 3 | 5;
}

function getTriadSemitones(key: Key): [number, number, number] {
  const root = KEY_TO_SEMITONE[key] ?? 0;
  return [root, (root + 4) % 12, (root + 7) % 12];
}

/** First fret on string that produces the note (0–11). */
function fretForNoteFirst(stringOpen: number[], stringIndex: number, note: number): number {
  const open = stringOpen[stringIndex];
  return (note - open + 12) % 12;
}

/**
 * Returns the three (stringIndex, fret, degree) for the nearest playable voicing
 * of the given key and position on the given string set. We prefer the 12th-fret
 * region over open strings where applicable.
 */
function getTriadPositionsWithStringOpen(
  stringOpen: number[],
  key: Key,
  position: Position
): TriadPosition[] {
  const [root, third, fifth] = getTriadSemitones(key);
  const roles = POSITION_ROLES[position];
  const notes = [root, third, fifth];
  const roleToDegree = (r: number): 1 | 3 | 5 => (r === 0 ? 1 : r === 1 ? 3 : 5);
  const result: TriadPosition[] = [];
  for (let s = 0; s < 3; s++) {
    const role = roles[s];
    const note = notes[role];
    let fret = fretForNoteFirst(stringOpen, s, note);
    result.push({ stringIndex: s, fret, degree: roleToDegree(role) });
  }
  const frets = result.map((p) => p.fret);
  const hasOpenString = frets.some((f) => f === 0);
  const hasHighFret = frets.some((f) => f >= 10);
  const hasLowFret = frets.some((f) => f < 5);
  const shiftLowFrets =
    (position === "root" || position === "1st") &&
    (hasOpenString || (hasHighFret && hasLowFret));
  if (shiftLowFrets) {
    for (const p of result) {
      if (p.fret < 5) p.fret += 12;
    }
  } else if (position === "2nd" && hasOpenString) {
    for (const p of result) {
      if (p.fret < 5) p.fret += 12;
    }
  }
  return result;
}

/** Stage 1 (G-B-e) positions. Kept for backward compatibility. */
export function getTriadPositions(key: Key, position: Position): TriadPosition[] {
  return getTriadPositionsWithStringOpen(STRING_OPEN_BY_STAGE[1], key, position);
}

/** Positions for the given string-set stage (1 or 2). For Stage 3, pass the card’s effective stage. */
export function getTriadPositionsForStage(
  stage: StringSetStage,
  key: Key,
  position: Position
): TriadPosition[] {
  return getTriadPositionsWithStringOpen(STRING_OPEN_BY_STAGE[stage], key, position);
}

/**
 * Fret window that contains exactly this voicing (min and max fret of the three positions).
 * Use for display so there is exactly one intended answer in view.
 */
export function getFretWindow(key: Key, position: Position): [number, number] {
  const positions = getTriadPositions(key, position);
  const frets = positions.map((p) => p.fret);
  return [Math.min(...frets), Math.max(...frets)];
}

/** Fret window for the given string-set stage. */
export function getFretWindowForStage(
  stage: StringSetStage,
  key: Key,
  position: Position
): [number, number] {
  const positions = getTriadPositionsForStage(stage, key, position);
  const frets = positions.map((p) => p.fret);
  return [Math.min(...frets), Math.max(...frets)];
}

const WIDTH_PROMPT_WINDOW = 5;

/**
 * All 5-fret-wide windows that contain the triad. Each window is [start, start+4] (0-based).
 */
function getPromptFretWindowOptions(
  stage: StringSetStage,
  key: Key,
  position: Position
): [number, number][] {
  const [minFret, maxFret] = getFretWindowForStage(stage, key, position);
  const startMin = Math.max(0, maxFret - (WIDTH_PROMPT_WINDOW - 1));
  const startMax = minFret;
  if (startMin > startMax) {
    return [[minFret, maxFret]];
  }
  const options: [number, number][] = [];
  for (let a = startMin; a <= startMax; a++) {
    options.push([a, a + WIDTH_PROMPT_WINDOW - 1]);
  }
  return options;
}

/** Simple numeric hash of a string for deterministic "random" choice. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * A 5-fret-wide window that contains the triad, chosen deterministically per card
 * so the same card always shows the same clue (one of the valid options).
 */
export function getPromptFretWindow(key: Key, position: Position): [number, number] {
  const options = getPromptFretWindowOptions(1, key, position);
  const seed = hashString(`${key}|${position}`);
  const index = seed % options.length;
  return options[index];
}

/** Prompt fret window for the given string-set stage. */
export function getPromptFretWindowForStage(
  stage: StringSetStage,
  key: Key,
  position: Position
): [number, number] {
  const options = getPromptFretWindowOptions(stage, key, position);
  const seed = hashString(`${key}|${position}`);
  const index = seed % options.length;
  return options[index];
}

/** For Stage 3: deterministic string set (1 or 2) per card so the same deck position always gets the same set. */
export function getEffectiveStageForCard(card: CardId, cardIndex: number, level: number): StringSetStage {
  const seed = hashString(`${cardId(card)}|${level}|${cardIndex}`);
  return (seed % 2 === 0 ? 1 : 2) as StringSetStage;
}

/** Format a 0-based fret window for display. Uses 0-based to match diagram labels so the clue and answer align. */
export function formatFretWindow(window: [number, number]): string {
  return `${window[0]}-${window[1]}`;
}

export interface CardId {
  key: Key;
  position: Position;
}

/** Keys in circle-of-fifths order (C → G → D → … → F) so new keys are introduced by moving around the circle. */
const KEYS_CIRCLE_OF_FIFTHS: Key[] = [
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "C#",
  "G#",
  "D#",
  "A#",
  "F",
];

/** Curriculum: 12 keys (circle of fifths) × 3 positions = 36 cards. Deck N = slice of 10. */
export const CURRICULUM: CardId[] = KEYS_CIRCLE_OF_FIFTHS.flatMap((key) =>
  (["root", "1st", "2nd"] as const).map((position) => ({ key, position }))
);

/** Level 3: 6 keys (formerly levels 3 and 4). 10 random cards from this pool. */
const KEYS_LEVEL_3: Key[] = ["F#", "C#", "G#", "D#", "A#", "F"];
const LEVEL_3_POOL: CardId[] = CURRICULUM.filter((c) => KEYS_LEVEL_3.includes(c.key));

export const CARDS_PER_DECK = 10;

export function getDeckForLevel(level: number): CardId[] {
  if (level === 3) {
    const shuffled = [...LEVEL_3_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, CARDS_PER_DECK);
  }
  const start = (level - 1) * CARDS_PER_DECK;
  return CURRICULUM.slice(start, start + CARDS_PER_DECK);
}

export function getTotalLevels(): number {
  return 3;
}

/** Cards in this level (before shuffle). For UI only. */
export function getLevelDeckSize(level: number): number {
  return CARDS_PER_DECK;
}

/** Seconds allowed per card before losing a life (flip in time). Level 1=9s, 2=8s, 3=7s. */
export function getSecondsPerCard(level: number): number {
  const byLevel: Record<number, number> = { 1: 9, 2: 8, 3: 7 };
  return byLevel[level] ?? 7;
}

/** Keys (circle-of-fifths order) covered in this level's deck, for UI. */
export function getKeysForLevel(level: number): Key[] {
  if (level === 3) return [...KEYS_LEVEL_3];
  const deck = getDeckForLevel(level);
  const keysInDeck = new Set(deck.map((c) => c.key));
  return KEYS_CIRCLE_OF_FIFTHS.filter((k) => keysInDeck.has(k));
}

export function cardId(card: CardId): string {
  return `${card.key}|${card.position}`;
}

/** Human-readable position label */
export function positionLabel(position: Position): string {
  switch (position) {
    case "root":
      return "root position";
    case "1st":
      return "1st inversion";
    case "2nd":
      return "2nd inversion";
  }
}
