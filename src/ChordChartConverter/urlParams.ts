/**
 * Serialize and parse key + progression to/from URL search params.
 * Params: k = key (e.g. "C-major", "Bb-minor"), c = chords (comma-separated codes).
 * Chord code: root + quality + extension + optional /slash, e.g. "C", "Am7", "Bbdim7", "Dm/G".
 */

import type { Chord, Key } from "./types";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"] as const;
type Letter = (typeof LETTERS)[number];

function isLetter(s: string): s is Letter {
  return LETTERS.includes(s as Letter);
}

/** Key to URL string: "C-major", "Bb-minor", "F#-major" */
export function keyToParam(key: Key): string {
  const tonic = key.tonic.letter + (key.tonic.accidental ?? "");
  return `${tonic}-${key.mode}`;
}

/** Parse key from URL string. Returns null if invalid. */
export function paramToKey(s: string): Key | null {
  const parts = s.split("-");
  if (parts.length < 2) return null;
  const mode = parts.pop();
  if (mode !== "major" && mode !== "minor") return null;
  const tonicStr = parts.join("-");
  if (!tonicStr.length) return null;
  const letter = tonicStr[0];
  if (!isLetter(letter)) return null;
  let accidental: "#" | "b" | undefined;
  const rest = tonicStr.slice(1);
  if (rest === "#" || rest === "b") accidental = rest as "#" | "b";
  else if (rest.length > 0) return null;
  return { tonic: { letter, accidental }, mode };
}

/** Chord to URL-safe code: "C", "Am", "Am7", "Bbdim7", "Dm/G" */
export function chordToParam(chord: Chord): string {
  const root = chord.root.letter + (chord.root.accidental ?? "");
  const qual =
    chord.quality === "major"
      ? ""
      : chord.quality === "minor"
        ? "m"
        : chord.quality === "diminished"
          ? "dim"
          : chord.quality === "augmented"
            ? "aug"
            : chord.quality === "sus2"
              ? "s2"
              : "s4";
  const ext = chord.extension ?? "";
  const slash = chord.slashBass
    ? "/" + chord.slashBass.letter + (chord.slashBass.accidental ?? "")
    : "";
  return `${root}${qual}${ext}${slash}`;
}

/** Parse one chord code. Returns null if invalid. */
export function paramToChord(s: string): Chord | null {
  const raw = s.trim();
  if (!raw.length) return null;
  let i = 0;
  if (!isLetter(raw[i])) return null;
  const letter = raw[i++] as Letter;
  let accidental: "#" | "b" | undefined;
  if (raw[i] === "#" || raw[i] === "b") {
    accidental = raw[i] as "#" | "b";
    i++;
  }
  const root = { letter, accidental };

  const qualMatch = raw.slice(i).match(/^(m|dim|aug|s2|s4)?(maj7|m7b5|dim7|m7|7)?(\/([A-G](#|b)?))?/);
  if (!qualMatch) return { root, quality: "major" };

  const [, qual, ext, , slashRoot] = qualMatch;
  const quality =
    qual === "m"
      ? "minor"
      : qual === "dim"
        ? "diminished"
        : qual === "aug"
          ? "augmented"
          : qual === "s2"
            ? "sus2"
            : qual === "s4"
              ? "sus4"
              : "major";
  const extension =
    ext === "7"
      ? ("7" as const)
      : ext === "maj7"
        ? ("maj7" as const)
        : ext === "m7"
          ? ("m7" as const)
          : ext === "dim7"
            ? ("dim7" as const)
            : ext === "m7b5"
              ? ("m7b5" as const)
              : undefined;
  let slashBass: { letter: Letter; accidental?: "#" | "b" } | undefined;
  if (slashRoot && isLetter(slashRoot[0])) {
    const acc = slashRoot[1] === "#" || slashRoot[1] === "b" ? slashRoot[1] : undefined;
    slashBass = { letter: slashRoot[0] as Letter, accidental: acc };
  }
  return { root, quality, extension, slashBass };
}

/** Parse comma-separated chord codes. Returns array (skips invalid). */
export function paramToChords(s: string): Chord[] {
  return s.split(",").reduce<Chord[]>((acc, part) => {
    const chord = paramToChord(part);
    if (chord) acc.push(chord);
    return acc;
  }, []);
}

/** Chords to URL param value (comma-separated). */
export function chordsToParam(chords: Chord[]): string {
  return chords.map(chordToParam).join(",");
}
