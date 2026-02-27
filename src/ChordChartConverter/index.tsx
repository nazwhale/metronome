import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LanguageProvider } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import QandA, { type QAItem } from "../components/QandA";
import ToolPracticeGuide from "../components/ToolPracticeGuide";
import type { Chord, Key } from "./types";
import { romanFromChord, getDiatonicChords, chordFromDegree } from "./romanNumerals";
import {
  keyToParam,
  paramToKey,
  chordsToParam,
  paramToChords,
} from "./urlParams";
import KeySelector from "./KeySelector";
import ChordBuilder from "./ChordBuilder";
import ProgressionList from "./ProgressionList";
import RomanOutput from "./RomanOutput";

function getRomanNumeralsCopyText(keyState: Key, chords: Chord[]): string {
  if (chords.length === 0) return "";
  const formatRoman = (s: string) => s.replace(/b/g, "♭").replace(/#/g, "♯");
  return chords.map((c) => formatRoman(romanFromChord(keyState, c))).join(" – ");
}

/** Preset progressions in the current key (triads only). */
function getPresetProgressions(key: Key): {
  id: string;
  label: string;
  chords: Chord[];
}[] {
  return [
    {
      id: "50s",
      label: "50s progression (I–vi–IV–V)",
      chords: [
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 6, "minor"),
        chordFromDegree(key, 4, "major"),
        chordFromDegree(key, 5, "major"),
      ],
    },
    {
      id: "andalusian",
      label: "Andalusian cadence (iv–III–♭II–I)",
      chords: [
        chordFromDegree(key, 4, "minor"),
        chordFromDegree(key, 3, "major"),
        chordFromDegree(key, 2, "major", "b"),
        chordFromDegree(key, 1, "major"),
      ],
    },
    {
      id: "twelve-bar",
      label: "Twelve-bar blues",
      chords: [
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 4, "major"),
        chordFromDegree(key, 4, "major"),
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 5, "major"),
        chordFromDegree(key, 4, "major"),
        chordFromDegree(key, 1, "major"),
        chordFromDegree(key, 5, "major"),
      ],
    },
  ];
}

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What are Roman numeral chords?",
    answer: (
      <p>
        Roman numeral chords are a way of naming chords by their position (scale degree) in a key, not by the actual note names. Uppercase numerals (I, IV, V) usually mean major chords; lowercase (ii, vi) mean minor; a degree symbol (°) means diminished. For example, in C major, I = C, IV = F, V = G, and ii = D minor. This makes it easy to talk about chord progressions in any key—e.g. “I – V – vi – IV” is the same pattern in every key.
      </p>
    ),
  },
  {
    question: "How do you write chord progressions in Roman numerals?",
    answer: (
      <p>
        Pick a key (e.g. C major), then label each chord by the scale degree of its root: 1 = I, 2 = ii, 3 = iii, 4 = IV, 5 = V, 6 = vi, 7 = vii°. Use uppercase for major and augmented, lowercase for minor and diminished. Add accidentals for chords outside the key (e.g. bVII for a flat-seven chord). Extensions like 7ths go after the numeral (e.g. V7, ii7). Use this tool above to build a progression and see the Roman numerals update in real time.
      </p>
    ),
  },
  {
    question: "What does I IV V mean in music?",
    answer: (
      <p>
        <strong>I – IV – V</strong> is one of the most common chord progressions. In any major key, I is the tonic (home), IV is the subdominant, and V is the dominant. In C major that’s C – F – G; in G major it’s G – C – D. The progression creates a strong sense of movement and resolution and is the backbone of countless rock, blues, and pop songs. Adding a seventh to the V chord (V7) strengthens the pull back to I.
      </p>
    ),
  },
  {
    question: "How do Roman numerals work in minor keys?",
    answer: (
      <p>
        In minor keys we still use scale degrees 1–7, but based on the <strong>natural minor</strong> scale. So in A minor, i = Am, iv = Dm, v = Em, and VII = G (uppercase because it’s major in natural minor). Lowercase numerals (i, ii°, iii, iv, v, VI, VII) match the quality of each chord in the natural minor scale. This tool uses natural minor only; harmonic and melodic minor aren’t applied in the Roman numeral output.
      </p>
    ),
  },
  {
    question: "What is a chord progression?",
    answer: (
      <p>
        A <strong>chord progression</strong> is a sequence of chords played in order, usually repeating (e.g. in a verse or chorus). Progressions define the harmony of a song and create tension and release (e.g. moving from V to I for resolution). Common examples include I – V – vi – IV (the “pop” progression), I – IV – V, and ii – V – I in jazz. You can describe the same progression in any key using Roman numerals—e.g. I – V – vi – IV in C is C – G – Am – F. Use the tool above to build and label your own progressions.
      </p>
    ),
  },
];

const TITLE = "Roman Numeral Chord Translator";
const DESCRIPTION =
  "Build a chord progression and see Roman numerals in your chosen key. Select key and add chords to get instant Roman numeral notation.";

const DEFAULT_KEY: Key = {
  tonic: { letter: "C" },
  mode: "major",
};

export default function ChordChartConverter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyState, setKeyState] = useState<Key>(() => {
    const k = searchParams.get("k");
    if (!k) return DEFAULT_KEY;
    const parsed = paramToKey(k);
    return parsed ?? DEFAULT_KEY;
  });
  const [progression, setProgression] = useState<Chord[]>(() => {
    const c = searchParams.get("c");
    return c ? paramToChords(c) : [];
  });

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("k", keyToParam(keyState));
        if (progression.length > 0) {
          next.set("c", chordsToParam(progression));
        } else {
          next.delete("c");
        }
        return next;
      },
      { replace: true }
    );
  }, [keyState, progression, setSearchParams]);

  const [copied, setCopied] = useState(false);

  const handleCopyRomans = useCallback(() => {
    const text = getRomanNumeralsCopyText(keyState, progression);
    if (!text) return;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [keyState, progression]);

  const handleAddChord = useCallback((chord: Chord) => {
    setProgression((prev) => [...prev, chord]);
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setProgression((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setProgression((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setProgression((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <LanguageProvider lang="en">
      <SEO
        title={`${TITLE} | tempotick`}
        description={DESCRIPTION}
        lang="en"
        canonicalPath="/chord-chart-converter"
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{TITLE}</h1>
          <p className="text-base-content/80 mt-2">
            Build a chord progression and see Roman numerals in your chosen key.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-semibold mb-2 text-left">Key</h2>
            <KeySelector value={keyState} onChange={setKeyState} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2 text-left">Add chord</h2>
            <p className="text-sm text-base-content/70 mb-1 text-left">Diatonic in key:</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {getDiatonicChords(keyState).map(({ chord, numeral }, i) => (
                <button
                  key={i}
                  type="button"
                  className="btn btn-ghost btn-sm font-mono"
                  onClick={() => handleAddChord(chord)}
                  aria-label={`Add ${numeral}`}
                >
                  {numeral}
                </button>
              ))}
            </div>
            <p className="text-sm text-base-content/70 mb-1 text-left">Custom chord:</p>
            <ChordBuilder onAdd={handleAddChord} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2 text-left">Progression</h2>
            <ProgressionList
              keyState={keyState}
              chords={progression}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onRemove={handleRemove}
            />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold text-left">Roman numerals</h2>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleCopyRomans}
                disabled={progression.length === 0}
                aria-label="Copy Roman numerals"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <RomanOutput keyState={keyState} chords={progression} />
            <p className="text-base-content/60 text-sm mt-2">
              <span className="text-warning font-medium">Highlighted</span> numerals are non-diatonic: the chord’s root is outside the key and/or its quality doesn’t match the scale (e.g. iv in a major key).
            </p>
            <p className="text-sm text-base-content/70 mb-1.5 mt-3 text-left">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {getPresetProgressions(keyState).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="btn btn-ghost btn-sm text-left normal-case"
                  onClick={() => setProgression(preset.chords)}
                  aria-label={`Load ${preset.label}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

          <div className="divider my-8" />

          <section>
            <ToolPracticeGuide
              title="Practice with the Roman Numeral Chord Translator"
              features={[
                "Key selector — choose tonic (A–G, optional ♯/♭) and mode (Major or Minor).",
                "Diatonic quick-add — one-click buttons (I, ii, iii, …) to add in-key chords.",
                "Full chord builder — root, quality (major, minor, dim, aug, sus2, sus4), extensions (7, maj7, m7, dim7, m7b5), optional slash bass.",
                "Progression list — reorder (up/down) and remove chords; see chord symbol and Roman numeral per chord.",
                "Roman output — live numerals with ♭/♯; copy button to paste into charts or notes.",
                "Non-diatonic highlighting — chords outside the key or with altered quality are highlighted.",
              ]}
              howToUseSteps={[
                "Select your key (e.g. C major or A minor) at the top.",
                "Add chords: use the diatonic buttons for in-key triads, or the full builder for 7ths, slash chords, or non-diatonic chords.",
                "Build the progression in order; use Up/Down to reorder and Remove to delete.",
                "Read the Roman numerals in the output; use Copy to paste the progression elsewhere.",
                "Change the key to see how the same chord symbols re-label in a different key.",
              ]}
              exampleRoutine={
                <>
                  <p className="m-0">
                    <strong>Learn a progression (5 min):</strong> Pick a key and build a common progression (e.g. I – V – vi – IV) with the diatonic buttons. Copy the numerals and say them out loud to internalise the pattern.
                  </p>
                  <p className="m-0 mt-1.5">
                    <strong>Transpose in your head (5–10 min):</strong> Build a progression in C major, then change the key to G, F, or A minor. Watch how the Roman numerals stay the same while the actual chords change—great for understanding “the same progression in any key”.
                  </p>
                  <p className="m-0 mt-1.5">
                    <strong>Borrowed chords (5 min):</strong> In a major key, add iv or bVII and see them highlighted as non-diatonic. Use this to spot borrowed chords and modal mixture in songs.
                  </p>
                </>
              }
              settingsExplained={
                <>
                  <p className="m-0">
                    <strong>Key:</strong> The tonic note (A–G, with optional sharp or flat) and mode (Major or Minor). All Roman numerals are relative to this key; diatonic quick-add and highlighting use it too.
                  </p>
                  <p className="m-0 mt-1.5">
                    <strong>Chord quality:</strong> Major, minor, diminished, augmented, sus2, sus4. Uppercase numerals = major-type; lowercase = minor or diminished; ° = diminished, ø = half-diminished (m7b5).
                  </p>
                  <p className="m-0 mt-1.5">
                    <strong>Extensions:</strong> 7, maj7, m7, dim7, m7b5. Shown after the numeral (e.g. V7, iiø7). Slash bass is for display only—the numeral is still based on the chord root.
                  </p>
                  <p className="m-0 mt-1.5">
                    <strong>Highlighted numerals:</strong> Orange/warning colour means the chord is non-diatonic—either the root is outside the key (e.g. bVII) or the quality doesn’t match the scale (e.g. iv in a major key).
                  </p>
                </>
              }
              otherTools={[
                { path: "/chord-progression-trainer", name: "Chord progression trainer" },
                { path: "/dictionary", name: "Musical dictionary" },
              ]}
            />
          </section>

          <div className="divider my-8" />

          <section>
            <QandA items={FAQ_ITEMS} title="Frequently asked questions" />
          </section>
        </div>
      </div>
    </LanguageProvider>
  );
}
