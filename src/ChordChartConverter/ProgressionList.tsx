import type { Chord, Key } from "./types";
import { chordToSymbol } from "./chordSymbol";
import { romanFromChord, isChordDiatonic } from "./romanNumerals";

type Props = {
  keyState: Key;
  chords: Chord[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
};

export default function ProgressionList({
  keyState,
  chords,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
  if (chords.length === 0) {
    return (
      <p className="text-base-content/60 text-sm">No chords yet. Add chords above.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {chords.map((chord, index) => (
        <li
          key={index}
          className="flex items-center gap-3 p-2 rounded-lg bg-base-200"
        >
          <span className="font-mono font-medium min-w-[6rem]">
            {chordToSymbol(chord)}
          </span>
          <span
            className={
              isChordDiatonic(keyState, chord)
                ? "font-medium"
                : "font-medium text-warning"
            }
          >
            {romanFromChord(keyState, chord)}
          </span>
          <div className="flex gap-1 ml-auto">
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => onMoveDown(index)}
              disabled={index === chords.length - 1}
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={() => onRemove(index)}
              aria-label="Remove"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
