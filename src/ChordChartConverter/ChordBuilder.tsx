import { useState } from "react";
import type { Chord, ChordQuality, Extension } from "./types";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"] as const;
const ACCIDENTALS = [undefined, "#", "b"] as const;

const QUALITIES: { value: ChordQuality; label: string }[] = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "diminished", label: "Dim" },
  { value: "augmented", label: "Aug" },
  { value: "sus2", label: "sus2" },
  { value: "sus4", label: "sus4" },
];

const EXTENSIONS: { value: Extension | undefined; label: string }[] = [
  { value: undefined, label: "None" },
  { value: "7", label: "7" },
  { value: "maj7", label: "maj7" },
  { value: "m7", label: "m7" },
  { value: "dim7", label: "dim7" },
  { value: "m7b5", label: "m7b5" },
];

type Props = {
  onAdd: (chord: Chord) => void;
};

export default function ChordBuilder({ onAdd }: Props) {
  const [rootLetter, setRootLetter] = useState<typeof LETTERS[number]>("C");
  const [rootAccidental, setRootAccidental] = useState<"#" | "b" | undefined>(undefined);
  const [quality, setQuality] = useState<ChordQuality>("major");
  const [extension, setExtension] = useState<Extension | undefined>(undefined);
  const [slashLetter, setSlashLetter] = useState<typeof LETTERS[number] | null>(null);
  const [slashAccidental, setSlashAccidental] = useState<"#" | "b" | undefined>(undefined);

  const handleAdd = () => {
    const chord: Chord = {
      root: { letter: rootLetter, accidental: rootAccidental },
      quality,
      extension,
      slashBass:
        slashLetter != null
          ? { letter: slashLetter, accidental: slashAccidental }
          : undefined,
    };
    onAdd(chord);
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="label text-xs">Root</label>
        <div className="flex gap-1">
          {LETTERS.map((letter) => (
            <button
              key={letter}
              type="button"
              className={`btn btn-sm ${rootLetter === letter ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setRootLetter(letter)}
            >
              {letter}
            </button>
          ))}
          {ACCIDENTALS.map((acc) => (
            <button
              key={acc ?? "nat"}
              type="button"
              className={`btn btn-sm ${rootAccidental === acc ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setRootAccidental(acc)}
            >
              {acc ?? "♮"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label text-xs">Quality</label>
        <select
          className="select select-bordered select-sm"
          value={quality}
          onChange={(e) => setQuality(e.target.value as ChordQuality)}
        >
          {QUALITIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label text-xs">Extension</label>
        <select
          className="select select-bordered select-sm"
          value={extension ?? ""}
          onChange={(e) =>
            setExtension((e.target.value || undefined) as Extension | undefined)
          }
        >
          {EXTENSIONS.map(({ value, label }) => (
            <option key={value ?? "none"} value={value ?? ""}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label text-xs">Slash bass</label>
        <div className="flex gap-1 items-center">
          <select
            className="select select-bordered select-sm w-24"
            value={slashLetter ?? ""}
            onChange={(e) =>
              setSlashLetter((e.target.value || null) as typeof slashLetter)
            }
          >
            <option value="">None</option>
            {LETTERS.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
          {slashLetter != null && (
            <>
              {ACCIDENTALS.map((acc) => (
                <button
                  key={acc ?? "nat"}
                  type="button"
                  className={`btn btn-sm ${slashAccidental === acc ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setSlashAccidental(acc)}
                >
                  {acc ?? "♮"}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
      <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd}>
        Add chord
      </button>
    </div>
  );
}
