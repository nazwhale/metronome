/**
 * Data models for Roman Numeral Chord Translator.
 * Note = letter + optional accidental. Pitch class 0–11 is internal only.
 */

export type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type Accidental = "#" | "b";

export interface Note {
  letter: Letter;
  accidental?: Accidental;
}

export type ChordQuality =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "sus2"
  | "sus4";

export type Extension = "7" | "maj7" | "m7" | "dim7" | "m7b5";

export interface Chord {
  root: Note;
  quality: ChordQuality;
  extension?: Extension;
  slashBass?: Note;
}

export type KeyMode = "major" | "minor";

export interface Key {
  tonic: Note;
  mode: KeyMode;
}
