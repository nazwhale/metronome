import type { Chord } from "./types";

/** Format chord as symbol e.g. Dm7, F#m/G#. */
export function chordToSymbol(chord: Chord): string {
  const root = chord.root.letter + (chord.root.accidental ?? "");
  const q =
    chord.quality === "major"
      ? ""
      : chord.quality === "minor"
        ? "m"
        : chord.quality === "diminished"
          ? "°"
          : chord.quality === "augmented"
            ? "+"
            : chord.quality === "sus2"
              ? "sus2"
              : "sus4";
  const ext =
    chord.extension === "7"
      ? "7"
      : chord.extension === "maj7"
        ? "maj7"
        : chord.extension === "m7"
          ? "m7"
          : chord.extension === "dim7"
            ? "dim7"
            : chord.extension === "m7b5"
              ? "m7b5"
              : "";
  const slash = chord.slashBass
    ? "/" + chord.slashBass.letter + (chord.slashBass.accidental ?? "")
    : "";
  return `${root}${q}${ext}${slash}`;
}
