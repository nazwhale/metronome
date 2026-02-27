import { describe, it, expect } from "vitest";
import {
  keyScalePitchClasses,
  degreeFromPitchClass,
  romanFromChord,
  isChordDiatonic,
} from "./romanNumerals";
import type { Chord, Key } from "./types";

const C_MAJOR: Key = { tonic: { letter: "C" }, mode: "major" };
const A_MINOR: Key = { tonic: { letter: "A" }, mode: "minor" };

describe("Diatonic major", () => {
  it("C major key: C major chord → I", () => {
    const chord: Chord = { root: { letter: "C" }, quality: "major" };
    expect(romanFromChord(C_MAJOR, chord)).toBe("I");
  });

  it("C major key: D minor chord → ii", () => {
    const chord: Chord = { root: { letter: "D" }, quality: "minor" };
    expect(romanFromChord(C_MAJOR, chord)).toBe("ii");
  });

  it("C major key: G major chord → V", () => {
    const chord: Chord = { root: { letter: "G" }, quality: "major" };
    expect(romanFromChord(C_MAJOR, chord)).toBe("V");
  });
});

describe("Diatonic minor", () => {
  it("A minor key: A minor chord → i", () => {
    const chord: Chord = { root: { letter: "A" }, quality: "minor" };
    expect(romanFromChord(A_MINOR, chord)).toBe("i");
  });

  it("A minor key: E minor chord → v", () => {
    const chord: Chord = { root: { letter: "E" }, quality: "minor" };
    expect(romanFromChord(A_MINOR, chord)).toBe("v");
  });

  it("A minor key: G major chord → VII (natural minor)", () => {
    const chord: Chord = { root: { letter: "G" }, quality: "major" };
    expect(romanFromChord(A_MINOR, chord)).toBe("VII");
  });
});

describe("Non-diatonic and quality suffixes", () => {
  it("C major key: Bb major → bVII", () => {
    const chord: Chord = { root: { letter: "B", accidental: "b" }, quality: "major" };
    expect(romanFromChord(C_MAJOR, chord)).toBe("bVII");
  });

  it("C major key: F# diminished → #iv°", () => {
    const chord: Chord = {
      root: { letter: "F", accidental: "#" },
      quality: "diminished",
    };
    expect(romanFromChord(C_MAJOR, chord)).toBe("#iv°");
  });

  it("C major key: D half-diminished (m7b5) → iiø7", () => {
    const chord: Chord = {
      root: { letter: "D" },
      quality: "minor",
      extension: "m7b5",
    };
    expect(romanFromChord(C_MAJOR, chord)).toBe("iiø7");
  });
});

describe("keyScalePitchClasses", () => {
  it("C major scale is [0,2,4,5,7,9,11]", () => {
    expect(keyScalePitchClasses(C_MAJOR)).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it("A natural minor scale is [9,11,0,2,4,5,7]", () => {
    expect(keyScalePitchClasses(A_MINOR)).toEqual([9, 11, 0, 2, 4, 5, 7]);
  });
});

describe("degreeFromPitchClass", () => {
  it("diatonic degree in C major: C=1, D=2, G=5", () => {
    expect(degreeFromPitchClass(C_MAJOR, 0)).toEqual({ degree: 1, accidental: undefined });
    expect(degreeFromPitchClass(C_MAJOR, 2)).toEqual({ degree: 2, accidental: undefined });
    expect(degreeFromPitchClass(C_MAJOR, 7)).toEqual({ degree: 5, accidental: undefined });
  });

  it("non-diatonic in C major: Bb = b7", () => {
    expect(degreeFromPitchClass(C_MAJOR, 10)).toEqual({ degree: 7, accidental: "b" });
  });
});

describe("isChordDiatonic", () => {
  it("C major: IV (F major) is diatonic", () => {
    expect(isChordDiatonic(C_MAJOR, { root: { letter: "F" }, quality: "major" })).toBe(true);
  });

  it("C major: iv (F minor) is non-diatonic (wrong quality)", () => {
    expect(isChordDiatonic(C_MAJOR, { root: { letter: "F" }, quality: "minor" })).toBe(false);
  });

  it("C major: bVII (Bb major) is non-diatonic (root outside key)", () => {
    expect(isChordDiatonic(C_MAJOR, { root: { letter: "B", accidental: "b" }, quality: "major" })).toBe(false);
  });
});
