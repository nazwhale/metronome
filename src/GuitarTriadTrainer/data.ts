/**
 * Guitar Triad Trainer data: keys, positions (inversions), string set G-B-e.
 * Prompts: string set + bass-note chord tone + nearest playable voicing.
 * Standard tuning: G=7, B=11, e=4 (semitones, C=0).
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

/** String set: G (index 0), B (1), e (2). Open note semitones (C=0). */
const STRING_OPEN: number[] = [7, 11, 4]; // G, B, e

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

/** [role at G, role at B, role at e] where 0=root, 1=3rd, 2=5th. One voicing per inversion. */
const POSITION_ROLES: Record<Position, [number, number, number]> = {
  root: [0, 1, 2], // 1 on G, 3 on B, 5 on e (e.g. C major tab 5-5-3)
  "1st": [1, 2, 0], // 3 on G, 5 on B, 1 on e (e.g. C major tab 9-8-8)
  "2nd": [2, 0, 1], // 5 on G, root on B, 3 on e (e.g. C major tab 12-13-12, prefer over open)
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
function fretForNoteFirst(stringIndex: number, note: number): number {
  const open = STRING_OPEN[stringIndex];
  return (note - open + 12) % 12;
}

/**
 * Returns the three (stringIndex, fret, degree) for the nearest playable voicing
 * of the given key and position on G-B-e. We prefer the 12th-fret region over open
 * strings: root position (e.g. G major → 12-12-10), 2nd inversion (e.g. C major 2nd → 12-13-12).
 */
export function getTriadPositions(key: Key, position: Position): TriadPosition[] {
  const [root, third, fifth] = getTriadSemitones(key);
  const roles = POSITION_ROLES[position];
  const notes = [root, third, fifth];
  const roleToDegree = (r: number): 1 | 3 | 5 => (r === 0 ? 1 : r === 1 ? 3 : 5);
  const result: TriadPosition[] = [];
  for (let s = 0; s < 3; s++) {
    const role = roles[s];
    const note = notes[role];
    let fret = fretForNoteFirst(s, note);
    result.push({ stringIndex: s, fret, degree: roleToDegree(role) });
  }
  // Prefer 12th-fret region over open/low for root, 1st inversion (e.g. D# major 1st → 12-11-11), and 2nd inversion
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

/**
 * Fret window that contains exactly this voicing (min and max fret of the three positions).
 * Use for display so there is exactly one intended answer in view.
 */
export function getFretWindow(key: Key, position: Position): [number, number] {
  const positions = getTriadPositions(key, position);
  const frets = positions.map((p) => p.fret);
  return [Math.min(...frets), Math.max(...frets)];
}

const WIDTH_PROMPT_WINDOW = 5;

/**
 * All 5-fret-wide windows that contain the triad. Each window is [start, start+4] (0-based).
 */
function getPromptFretWindowOptions(key: Key, position: Position): [number, number][] {
  const [minFret, maxFret] = getFretWindow(key, position);
  const startMin = Math.max(0, maxFret - (WIDTH_PROMPT_WINDOW - 1));
  const startMax = minFret;
  if (startMin > startMax) {
    // Triad spans more than 5 frets; use tight window so the prompt always contains the triad
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
  const options = getPromptFretWindowOptions(key, position);
  const seed = hashString(`${key}|${position}`);
  const index = seed % options.length;
  return options[index];
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

export const CARDS_PER_DECK = 10;
export const BOSS_LEVEL = 5;
export const BOSS_DECK_SIZE = 20;

export function getDeckForLevel(level: number): CardId[] {
  if (level === BOSS_LEVEL) {
    const shuffled = [...CURRICULUM].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, BOSS_DECK_SIZE);
  }
  const start = (level - 1) * CARDS_PER_DECK;
  return CURRICULUM.slice(start, start + CARDS_PER_DECK);
}

export function getTotalLevels(): number {
  return BOSS_LEVEL;
}

/** Cards in this level (before shuffle). For UI only. */
export function getLevelDeckSize(level: number): number {
  return level === BOSS_LEVEL ? BOSS_DECK_SIZE : CARDS_PER_DECK;
}

/** Seconds allowed per card before losing a life (flip in time). Level 1=9s, 2=8s, 3=7s, 4=6s, 5=5s. */
export function getSecondsPerCard(level: number): number {
  const byLevel: Record<number, number> = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5 };
  return byLevel[level] ?? 5;
}

/** Keys (circle-of-fifths order) covered in this level's deck, for UI. Boss = all keys. */
export function getKeysForLevel(level: number): Key[] {
  if (level === BOSS_LEVEL) return [...KEYS_CIRCLE_OF_FIFTHS];
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
