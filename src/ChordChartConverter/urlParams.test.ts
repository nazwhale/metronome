import { describe, it, expect } from "vitest";
import {
  keyToParam,
  paramToKey,
  chordToParam,
  paramToChord,
  chordsToParam,
  paramToChords,
} from "./urlParams";
import type { Chord, Key } from "./types";

describe("keyToParam / paramToKey", () => {
  it("round-trips C major", () => {
    const key: Key = { tonic: { letter: "C" }, mode: "major" };
    expect(paramToKey(keyToParam(key))).toEqual(key);
  });

  it("round-trips Bb minor", () => {
    const key: Key = { tonic: { letter: "B", accidental: "b" }, mode: "minor" };
    expect(paramToKey(keyToParam(key))).toEqual(key);
  });

  it("round-trips F# major", () => {
    const key: Key = { tonic: { letter: "F", accidental: "#" }, mode: "major" };
    expect(paramToKey(keyToParam(key))).toEqual(key);
  });
});

describe("chordToParam / paramToChord", () => {
  it("round-trips C major", () => {
    const chord: Chord = { root: { letter: "C" }, quality: "major" };
    expect(paramToChord(chordToParam(chord))).toEqual(chord);
  });

  it("round-trips Am7", () => {
    const chord: Chord = { root: { letter: "A" }, quality: "minor", extension: "m7" };
    expect(paramToChord(chordToParam(chord))).toEqual(chord);
  });

  it("round-trips Bbdim7", () => {
    const chord: Chord = {
      root: { letter: "B", accidental: "b" },
      quality: "diminished",
      extension: "dim7",
    };
    expect(paramToChord(chordToParam(chord))).toEqual(chord);
  });

  it("round-trips Dm/G", () => {
    const chord: Chord = {
      root: { letter: "D" },
      quality: "minor",
      slashBass: { letter: "G" },
    };
    expect(paramToChord(chordToParam(chord))).toEqual(chord);
  });
});

describe("chordsToParam / paramToChords", () => {
  it("round-trips I V vi IV in C", () => {
    const chords: Chord[] = [
      { root: { letter: "C" }, quality: "major" },
      { root: { letter: "G" }, quality: "major" },
      { root: { letter: "A" }, quality: "minor" },
      { root: { letter: "F" }, quality: "major" },
    ];
    expect(paramToChords(chordsToParam(chords))).toEqual(chords);
  });
});
