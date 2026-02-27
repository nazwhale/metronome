import type { Key } from "./types";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"] as const;
const ACCIDENTALS = [undefined, "#", "b"] as const;
const MODES: { value: Key["mode"]; label: string }[] = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
];

type Props = {
  value: Key;
  onChange: (key: Key) => void;
};

export default function KeySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-medium">Key:</span>
      <div className="flex flex-wrap gap-2">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`btn btn-sm ${value.tonic.letter === letter ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onChange({ ...value, tonic: { letter, accidental: value.tonic.accidental } })}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {ACCIDENTALS.map((acc) => (
          <button
            key={acc ?? "nat"}
            type="button"
            className={`btn btn-sm ${value.tonic.accidental === acc ? "btn-primary" : "btn-ghost"}`}
            onClick={() =>
              onChange({
                ...value,
                tonic: { ...value.tonic, accidental: acc },
              })
            }
          >
            {acc ?? "♮"}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {MODES.map(({ value: modeValue, label }) => (
          <button
            key={modeValue}
            type="button"
            className={`btn btn-sm ${value.mode === modeValue ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onChange({ ...value, mode: modeValue })}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
