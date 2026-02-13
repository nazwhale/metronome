import { describe, it, expect } from "vitest";
import {
  getTriadPositions,
  getFretWindow,
  getPromptFretWindow,
  KEYS,
  POSITIONS,
  type TriadPosition,
} from "./data";

/** Assert positions match expected (G, B, e) frets and degrees. Tab order G-B-e. */
function expectTab(
  positions: TriadPosition[],
  expected: { g: number; b: number; e: number; degrees: [number, number, number] }
) {
  const byString: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
  const frets: Record<number, number> = {};
  const degrees: Record<number, number> = {};
  for (const p of positions) {
    byString[p.stringIndex]++;
    frets[p.stringIndex] = p.fret;
    degrees[p.stringIndex] = p.degree;
  }
  expect(byString[0]).toBe(1);
  expect(byString[1]).toBe(1);
  expect(byString[2]).toBe(1);
  expect(frets[0]).toBe(expected.g);
  expect(frets[1]).toBe(expected.b);
  expect(frets[2]).toBe(expected.e);
  expect(degrees[0]).toBe(expected.degrees[0]);
  expect(degrees[1]).toBe(expected.degrees[1]);
  expect(degrees[2]).toBe(expected.degrees[2]);
}

describe("getTriadPositions", () => {
  it("C major root position → tab x-x-x-5-5-3, intervals 1-3-5 (G-B-e)", () => {
    const positions = getTriadPositions("C", "root");
    expectTab(positions, { g: 5, b: 5, e: 3, degrees: [1, 3, 5] });
  });

  it("C major 1st inversion → tab x-x-x-9-8-8, intervals 3-5-1 (G-B-e)", () => {
    const positions = getTriadPositions("C", "1st");
    expectTab(positions, { g: 9, b: 8, e: 8, degrees: [3, 5, 1] });
  });

  it("C major 2nd inversion → 5 on G, root on B, 3 on e (tab 12-13-12, prefer over open)", () => {
    const positions = getTriadPositions("C", "2nd");
    expectTab(positions, { g: 12, b: 13, e: 12, degrees: [5, 1, 3] });
  });

  it("B major 2nd inversion → 11-12-11 (shift only open/low frets, not already-high)", () => {
    const positions = getTriadPositions("B", "2nd");
    expectTab(positions, { g: 11, b: 12, e: 11, degrees: [5, 1, 3] });
  });

  it("E major 2nd inversion → 4-5-4 (no shift when compact low voicing, no open string)", () => {
    const positions = getTriadPositions("E", "2nd");
    expectTab(positions, { g: 4, b: 5, e: 4, degrees: [5, 1, 3] });
  });

  it("G major root position → 12-12-10 (prefer 12th-fret over open strings)", () => {
    const positions = getTriadPositions("G", "root");
    expectTab(positions, { g: 12, b: 12, e: 10, degrees: [1, 3, 5] });
  });

  it("A major root position → 14-14-12 (prefer 12th-fret region when span is large)", () => {
    const positions = getTriadPositions("A", "root");
    expectTab(positions, { g: 14, b: 14, e: 12, degrees: [1, 3, 5] });
  });

  it("G# major root position → 13-13-11 (prefer 12th-fret when span is large)", () => {
    const positions = getTriadPositions("G#", "root");
    expectTab(positions, { g: 13, b: 13, e: 11, degrees: [1, 3, 5] });
  });

  it("D# major 1st inversion → 12-11-11 (prefer 12th-fret over open)", () => {
    const positions = getTriadPositions("D#", "1st");
    expectTab(positions, { g: 12, b: 11, e: 11, degrees: [3, 5, 1] });
  });

  it("A major 1st inversion → correct frets and 3-5-1 order", () => {
    const positions = getTriadPositions("A", "1st");
    expect(positions.length).toBe(3);
    const gPos = positions.find((p) => p.stringIndex === 0)!;
    const bPos = positions.find((p) => p.stringIndex === 1)!;
    const ePos = positions.find((p) => p.stringIndex === 2)!;
    expect(gPos.degree).toBe(3);
    expect(bPos.degree).toBe(5);
    expect(ePos.degree).toBe(1);
  });
});

describe("getFretWindow", () => {
  it("C major root → window [3, 5] contains exactly the voicing", () => {
    const window = getFretWindow("C", "root");
    expect(window).toEqual([3, 5]);
  });

  it("C major 1st inversion → window [8, 9]", () => {
    const window = getFretWindow("C", "1st");
    expect(window).toEqual([8, 9]);
  });

  it("C major 2nd inversion → window [12, 13]", () => {
    const window = getFretWindow("C", "2nd");
    expect(window).toEqual([12, 13]);
  });

  it("G major root → window [10, 12]", () => {
    const window = getFretWindow("G", "root");
    expect(window).toEqual([10, 12]);
  });
});

describe("prompt fret window contains triad", () => {
  it("for every key and position, the prompt window contains all triad frets (deterministic invariant)", () => {
    for (const key of KEYS) {
      for (const position of POSITIONS) {
        const positions = getTriadPositions(key, position);
        const [winMin, winMax] = getPromptFretWindow(key, position);
        for (const p of positions) {
          expect(p.fret).toBeGreaterThanOrEqual(winMin);
          expect(p.fret).toBeLessThanOrEqual(winMax);
        }
      }
    }
  });
});
