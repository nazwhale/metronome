import type { Quality, TriadPosition } from "./data";

/** String order: high (top), middle, low (bottom) — like looking at the neck */
const STRING_ORDER: [number, number, number] = [2, 1, 0];

/** Label for chord degree in the circle (e.g. ♭3 for minor third). */
function degreeLabel(degree: 1 | 3 | 5, quality: Quality): string {
  if (degree === 3 && quality === "minor") return "♭3";
  return String(degree);
}

/** Minimal fretboard strip showing only the fret range (no positions). For the question side. */
export function FretRangeDiagram({
  fretWindow,
  stringLabels,
}: {
  fretWindow: [number, number];
  /** Full 6 strings high to low (e, B, G, D, A, E). Triad strings show name; others show "x". */
  stringLabels: readonly [string, string, string, string, string, string];
}) {
  const [minFret, maxFret] = fretWindow;
  const fretCount = maxFret - minFret + 1;

  return (
    <div
      className="inline-block font-mono text-sm rounded-md overflow-hidden border border-base-content/20 bg-base-300/40"
      role="img"
      aria-label={`Fret range ${minFret} to ${maxFret}`}
    >
      <div className="flex flex-col gap-0 py-1 px-1">
        {stringLabels.map((label, stringIndex) => (
          <div key={stringIndex} className="flex items-center gap-0">
            <span
              className={`w-4 mr-1.5 flex justify-center ${label === "x" ? "text-xs text-base-content/40" : "text-sm text-base-content/85"}`}
            >
              {label}
            </span>
            <div className="flex">
              {Array.from({ length: fretCount }, (_, i) => (
                <div
                  key={i}
                  className="w-7 h-5 flex items-center justify-center border-r border-base-content/25 last:border-r-0"
                >
                  {" "}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex pl-5 mt-0.5 px-1">
        {Array.from({ length: fretCount }, (_, i) => {
          const isMiddleFret = i === Math.floor(fretCount / 2);
          return (
            <span
              key={i}
              className={`w-7 text-center tabular-nums ${isMiddleFret ? "text-sm text-base-content/80 font-medium" : "text-xs text-base-content/50"}`}
            >
              {minFret + i}
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface FretboardProps {
  positions: TriadPosition[];
  positionWindow: [number, number];
  stringLabels: [string, string, string];
  /** For minor triads, degree 3 is shown as ♭3. */
  quality?: Quality;
}

export default function Fretboard({ positions, positionWindow, stringLabels, quality = "major" }: FretboardProps) {
  const [minFret, maxFret] = positionWindow;
  const fretCount = maxFret - minFret + 1;
  const labelByIndex = (i: number) => stringLabels[i];

  /** Get the triad position (with degree) at this cell, if any */
  const getPositionAt = (stringIndex: number, fret: number): TriadPosition | undefined =>
    positions.find((p) => p.stringIndex === stringIndex && p.fret === fret);

  return (
    <div className="inline-block font-mono text-sm" role="img" aria-label={`Fretboard diagram with triad positions on ${stringLabels.join(", ")} strings`}>
      <div className="flex flex-col gap-0.5">
        {STRING_ORDER.map((stringIndex) => (
          <div key={stringIndex} className="flex items-center gap-0">
            <span className="w-4 text-base-content/70 mr-2">
              {labelByIndex(stringIndex)}
            </span>
            <div className="flex">
              {minFret === 0 && (
                <div
                  className="w-6 h-6 flex items-center justify-center border-r border-base-content/30"
                  aria-hidden
                >
                  |
                </div>
              )}
              {Array.from({ length: fretCount }, (_, i) => {
                const fret = minFret + i;
                const pos = getPositionAt(stringIndex, fret);
                return (
                  <div
                    key={fret}
                    className={`w-8 h-8 flex items-center justify-center border-r border-base-content/20 ${
                      pos ? "bg-primary/20" : ""
                    }`}
                  >
                    {pos ? (
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          pos.degree === 1
                            ? "bg-primary text-primary-content"
                            : "bg-secondary text-secondary-content ring-2 ring-secondary/60 ring-offset-2 ring-offset-base-200"
                        }`}
                        role="img"
                        aria-label={`Degree ${pos.degree === 3 && quality === "minor" ? "flat 3" : pos.degree}, fret ${fret + 1}`}
                      >
                        {degreeLabel(pos.degree, quality)}
                      </span>
                    ) : (
                      <span className="invisible w-4 h-4" aria-hidden />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex pl-6 mt-1">
        {minFret === 0 && <span className="w-6 text-base-content/50 text-xs">0</span>}
        {Array.from({ length: fretCount }, (_, i) => (
          <span
            key={i}
            className="w-8 text-center text-base-content/50 text-xs"
          >
            {minFret + i}
          </span>
        ))}
      </div>
    </div>
  );
}
