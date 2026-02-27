import type { Chord, Key } from "./types";
import { romanFromChord, isChordDiatonic } from "./romanNumerals";

type Props = {
  keyState: Key;
  chords: Chord[];
};

/** Display Roman numerals with Unicode ♭/♯ for copy-paste. */
function formatRoman(s: string): string {
  return s.replace(/b/g, "♭").replace(/#/g, "♯");
}

export default function RomanOutput({ keyState, chords }: Props) {
  if (chords.length === 0) {
    return (
      <p className="text-base-content/60 text-sm">
        Roman numerals will appear here as you add chords.
      </p>
    );
  }

  const items = chords.map((c) => ({
    roman: formatRoman(romanFromChord(keyState, c)),
    nonDiatonic: !isChordDiatonic(keyState, c),
  }));

  return (
    <div className="p-4 rounded-lg bg-base-200 font-mono text-lg flex flex-wrap items-baseline gap-x-1 gap-y-1">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="text-base-content/70"> – </span>}
          <span className={item.nonDiatonic ? "text-warning" : undefined}>
            {item.roman}
          </span>
        </span>
      ))}
    </div>
  );
}
