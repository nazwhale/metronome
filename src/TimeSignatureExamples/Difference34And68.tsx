import React from "react";
import { Link } from "react-router-dom";
import { LanguageProvider } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import QandA, { QAItem } from "../components/QandA";
import { TimeSignatureRow } from "./TimeSignatureRow";
import { TIME_SIGNATURE_CONFIGS } from "./data";
import type { TimeSignatureConfig } from "./data";

const TITLE = "Difference between 3/4 and 6/8";
const DESCRIPTION =
  "Compare 3/4 and 6/8 time signatures side by side. Hear and see the beat emphasis and subdivisions—3/4 has three beats per bar, 6/8 has two dotted beats.";

const CONFIGS_34_68: TimeSignatureConfig[] = TIME_SIGNATURE_CONFIGS.filter(
  (c) => c.label === "3/4" || c.label === "6/8"
);

const FAQ_ITEMS: QAItem[] = [
  {
    question: "Is 3/4 equivalent to 6/8 time signature?",
    answer: (
      <p>
        Not equivalent in feel. Both bars can contain the same number of eighth notes (six), but{" "}
        <strong>3/4</strong> has three main beats per bar (count “1-and-2-and-3-and”), while{" "}
        <strong>6/8</strong> has two main beats, each dividing into three (count “1-2-3-4-5-6” with emphasis on 1 and 4). So 3/4 feels like three beats; 6/8 feels like two. Use the examples above to hear the difference.
      </p>
    ),
  },
  {
    question: "How do you tell if a song is in 3/4 or 6/8?",
    answer: (
      <p>
        Listen for where the strong beats fall. If you feel <strong>three</strong> beats per bar (like a waltz: oom-cha-cha), it’s likely <strong>3/4</strong>. If you feel <strong>two</strong> heavier beats per bar, each with a lighter triple feel (one-two-three, four-five-six), it’s likely <strong>6/8</strong>. Try counting “1-2-3” vs “1-2-3-4-5-6” and see which fits the music.
      </p>
    ),
  },
  {
    question: "Is 6/8 the same as 3/4 fraction?",
    answer: (
      <p>
        As fractions, 6/8 and 3/4 both simplify to 3/4 in math—but in music they are <strong>not</strong> the same. The time signature tells you how many beats per bar and what gets the beat. In <strong>3/4</strong> there are 3 quarter-note beats; in <strong>6/8</strong> there are 2 dotted-quarter beats (each equal to 3 eighth notes). The grouping and emphasis are different, so the feel is different.
      </p>
    ),
  },
  {
    question: "Is a waltz in 3/4 or 6/8?",
    answer: (
      <p>
        A waltz is in <strong>3/4</strong>. It has three beats per bar (strong-weak-weak), which gives the characteristic “oom-cha-cha” feel. Music in <strong>6/8</strong> has two main beats per bar and a different lilt (e.g. many ballads and Irish jigs). So if it’s a waltz, you’re in 3/4.
      </p>
    ),
  },
];

const Difference34And68Page: React.FC = () => {
  return (
    <LanguageProvider lang="en">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        lang="en"
        canonicalPath="/time-signature-examples/difference-between-34-and-68"
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{TITLE}</h1>
          <p className="text-base-content/80 mt-2">
            Compare these two time signatures side by side. Press play on each to hear the beat emphasis
            and watch the subdivisions (1 e + a for 3/4, 1 2 3 4 5 6 for 6/8).
          </p>
          <p className="text-base-content/60 text-sm mt-2">
            <Link to="/time-signature-examples" className="link link-primary">
              All time signature examples
            </Link>
            {" · "}
            <Link to="/online-metronome" className="link link-primary">
              Online metronome
            </Link>
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {CONFIGS_34_68.map((config) => (
            <TimeSignatureRow key={config.label} config={config} />
          ))}
        </div>

        <div className="divider my-8" />
        <QandA items={FAQ_ITEMS} title="Frequently asked questions" />
      </div>
    </LanguageProvider>
  );
};

export default Difference34And68Page;
