/**
 * Pure mapping logic: note ↔ pitch class, key scale, degree, Roman numeral.
 * Pitch class: C=0, C#/Db=1, … B=11.
 */

import type { Chord, Key, Letter, Note } from "./types";

const LETTER_TO_PC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Map note name to 0–11. Accepts both F# and Gb → same PC. */
export function noteToPitchClass(note: Note): number {
  let pc = LETTER_TO_PC[note.letter];
  if (note.accidental === "#") pc = (pc + 1) % 12;
  else if (note.accidental === "b") pc = (pc - 1 + 12) % 12;
  return pc;
}

/** Flat keys: F, Bb, Eb, Ab, Db, Gb, Cb. Sharp keys: G, D, A, E, B, F#, C#. */
function keyPrefersFlats(key: Key): boolean {
  const pc = noteToPitchClass(key.tonic);
  const flatKeys = new Set([5, 10, 3, 8, 1, 6, 11]); // F, Bb, Eb, Ab, Db, Gb, Cb
  return flatKeys.has(pc);
}

/** Map 0–11 to Note. preferFlats from key. */
export function pitchClassToNote(pc: number, preferFlats: boolean): Note {
  const base: Record<
    number,
    { letter: Letter; accidental?: "#" | "b" }
  > = {
    0: { letter: "C" },
    1: { letter: preferFlats ? "D" : "C", accidental: preferFlats ? "b" : "#" },
    2: { letter: "D" },
    3: { letter: preferFlats ? "E" : "D", accidental: preferFlats ? "b" : "#" },
    4: { letter: "E" },
    5: { letter: "F" },
    6: { letter: preferFlats ? "G" : "F", accidental: preferFlats ? "b" : "#" },
    7: { letter: "G" },
    8: { letter: preferFlats ? "A" : "G", accidental: preferFlats ? "b" : "#" },
    9: { letter: "A" },
    10: { letter: preferFlats ? "B" : "A", accidental: preferFlats ? "b" : "#" },
    11: { letter: "B" },
  };
  const { letter, accidental } = base[(pc + 12) % 12];
  return { letter, accidental };
}

/** Major scale intervals from tonic (in semitones): 0,2,4,5,7,9,11. */
const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11];
/** Natural minor scale intervals from tonic: 0,2,3,5,7,8,10. */
const NATURAL_MINOR_SCALE_STEPS = [0, 2, 3, 5, 7, 8, 10];

/** Return 7 pitch classes (scale degrees 1–7) for the key. */
export function keyScalePitchClasses(key: Key): number[] {
  const tonicPC = noteToPitchClass(key.tonic);
  const steps = key.mode === "major" ? MAJOR_SCALE_STEPS : NATURAL_MINOR_SCALE_STEPS;
  return steps.map((s) => (tonicPC + s) % 12);
}

export interface DegreeResult {
  degree: number;
  accidental: "b" | "#" | undefined;
}

/**
 * Express pitchClass as a scale degree (1–7) in key, with optional accidental.
 * Diatonic → accidental undefined. Non-diatonic: use nearest degree + b or #.
 * Prefer flat when lowering (b7 not #6); prefer sharp when raising (#4 not b5 for tritone).
 */
export function degreeFromPitchClass(key: Key, pitchClass: number): DegreeResult {
  const scale = keyScalePitchClasses(key);
  const diatonicIndex = scale.indexOf(pitchClass);
  if (diatonicIndex >= 0) {
    return { degree: diatonicIndex + 1, accidental: undefined };
  }
  const candidates: DegreeResult[] = [];
  for (let d = 1; d <= 7; d++) {
    const diatonicPC = scale[d - 1];
    let diff = (pitchClass - diatonicPC + 12) % 12;
    if (diff > 6) diff -= 12;
    if (diff === 1) candidates.push({ degree: d, accidental: "#" as const });
    else if (diff === -1) candidates.push({ degree: d, accidental: "b" as const });
  }
  if (candidates.length === 0) {
    const tonicPC = noteToPitchClass(key.tonic);
    let step = (pitchClass - tonicPC + 12) % 12;
    if (step > 6) step -= 12;
    const scaleStep = Math.round((step * 7) / 12);
    let degree = ((scaleStep % 7) + 7) % 7;
    if (degree === 0) degree = 7;
    const diatonicPC = scale[degree - 1];
    let diff = (pitchClass - diatonicPC + 12) % 12;
    if (diff > 6) diff -= 12;
    const accidental: "b" | "#" = diff < 0 ? "b" : "#";
    return { degree, accidental };
  }
  if (candidates.length === 2) {
    const sharpCandidate = candidates.find((c) => c.accidental === "#");
    const flatCandidate = candidates.find((c) => c.accidental === "b");
    if (
      sharpCandidate &&
      flatCandidate &&
      sharpCandidate.degree + 1 === flatCandidate.degree
    ) {
      return flatCandidate.degree === 7 ? flatCandidate : sharpCandidate;
    }
  }
  return candidates[0];
}

const ROMAN_UP = ["I", "II", "III", "IV", "V", "VI", "VII"];
const ROMAN_LOW = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

/**
 * Roman numeral string for chord in key. Numeral by chord root only; slash bass not shown.
 */
export function romanFromChord(key: Key, chord: Chord): string {
  const rootPC = noteToPitchClass(chord.root);
  const { degree, accidental } = degreeFromPitchClass(key, rootPC);
  const isHalfDim = chord.extension === "m7b5";
  const uppercase =
    !isHalfDim &&
    (chord.quality === "major" ||
      chord.quality === "augmented" ||
      chord.quality === "sus2" ||
      chord.quality === "sus4");
  const isDim = chord.quality === "diminished";
  const romanDigit = uppercase ? ROMAN_UP[degree - 1] : ROMAN_LOW[degree - 1];
  let acc = "";
  if (accidental === "b") acc = "b";
  else if (accidental === "#") acc = "#";
  let suffix = "";
  if (isDim) suffix = "°";
  else if (isHalfDim) suffix = "ø";
  else if (chord.quality === "augmented") suffix = "+";
  else if (chord.quality === "sus2") suffix = "sus2";
  else if (chord.quality === "sus4") suffix = "sus4";
  let ext = "";
  if (chord.extension === "7") ext = "7";
  else if (chord.extension === "maj7") ext = "maj7";
  else if (chord.extension === "m7") ext = "7";
  else if (chord.extension === "dim7") ext = "7";
  else if (chord.extension === "m7b5") ext = "7";
  return `${acc}${romanDigit}${suffix}${ext}`;
}

/** Diatonic triad quality for each scale degree (1–7). Major key: I ii iii IV V vi vii°. Minor: i ii° III iv v VI VII. */
function getDiatonicQuality(key: Key, degree: number): "major" | "minor" | "diminished" {
  if (key.mode === "major") {
    const q: ("major" | "minor" | "diminished")[] = ["major", "minor", "minor", "major", "major", "minor", "diminished"];
    return q[degree - 1];
  }
  const q: ("major" | "minor" | "diminished")[] = ["minor", "diminished", "major", "minor", "minor", "major", "major"];
  return q[degree - 1];
}

/** True only if the chord is fully diatonic: root in key and chord quality matches the scale's chord at that degree. */
export function isChordDiatonic(key: Key, chord: Chord): boolean {
  const rootPC = noteToPitchClass(chord.root);
  const { degree, accidental } = degreeFromPitchClass(key, rootPC);
  if (accidental !== undefined) return false;
  const expected = getDiatonicQuality(key, degree);
  if (chord.quality === "augmented" || chord.quality === "sus2" || chord.quality === "sus4") return false;
  if (chord.quality === "major") return expected === "major";
  if (chord.quality === "minor") return expected === "minor";
  if (chord.quality === "diminished") return expected === "diminished";
  if (chord.extension === "m7b5") return expected === "diminished";
  return true;
}

/** For UI: whether key uses flat preference (for note spelling if needed). */
export function keyPrefersFlatsForSpelling(key: Key): boolean {
  return keyPrefersFlats(key);
}

/** The 7 diatonic triads in the key (degree 1–7), with chord and Roman numeral label for quick-add. */
export function getDiatonicChords(key: Key): { chord: Chord; numeral: string }[] {
  const scalePCs = keyScalePitchClasses(key);
  const preferFlats = keyPrefersFlats(key);
  return scalePCs.map((pc, i) => {
    const degree = i + 1;
    const root = pitchClassToNote(pc, preferFlats);
    const quality = getDiatonicQuality(key, degree);
    const chord: Chord = { root, quality };
    return { chord, numeral: romanFromChord(key, chord) };
  });
}

/** Build one chord from scale degree (1–7), optional accidental, and quality. For preset progressions. */
export function chordFromDegree(
  key: Key,
  degree: number,
  quality: Chord["quality"],
  accidental?: "b" | "#"
): Chord {
  const scale = keyScalePitchClasses(key);
  let pc = scale[(degree - 1 + 7) % 7];
  if (accidental === "b") pc = (pc - 1 + 12) % 12;
  else if (accidental === "#") pc = (pc + 1) % 12;
  const root = pitchClassToNote(pc, keyPrefersFlats(key));
  return { root, quality };
}
