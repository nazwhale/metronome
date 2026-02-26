import React from "react";
import { Link } from "react-router-dom";
import { LanguageProvider } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import QandA, { QAItem } from "../components/QandA";
import { TimeSignatureRow } from "./TimeSignatureRow";
import { TIME_SIGNATURE_CONFIGS } from "./data";
import type { TimeSignatureConfig } from "./data";

const TITLE = "Difference between 3/2 and 6/4";
const DESCRIPTION =
  "Compare 3/2 and 6/4 time signatures side by side. 3/2 has three half-note beats per bar; 6/4 has two dotted-half beats. Hear and see the difference.";

const CONFIGS_32_64: TimeSignatureConfig[] = TIME_SIGNATURE_CONFIGS.filter(
  (c) => c.label === "3/2" || c.label === "6/4"
);

const FAQ_ITEMS: QAItem[] = [
  {
    question: "Is 6/4 the same as 3/2 time signature?",
    answer: (
      <p>
        No. Both have six quarter notes’ worth of time per bar, but the <strong>beat structure</strong> is different.{" "}
        <strong>3/2</strong> is simple triple: three half-note beats per bar (count “1-and-2-and-3-and”).{" "}
        <strong>6/4</strong> is compound duple: two dotted-half beats per bar, each dividing into three (count “1-2-3-4-5-6” with emphasis on 1 and 4). So 3/2 feels like three beats; 6/4 feels like two. Use the examples above to hear the difference.
      </p>
    ),
  },
  {
    question: "Are 3/2 and 6/4 the same?",
    answer: (
      <p>
        No. They share the same total bar length in terms of quarter notes (six), but <strong>3/2</strong> has three main beats (half note = beat) and <strong>6/4</strong> has two main beats (dotted half = beat). The grouping and emphasis differ: 3/2 is “one-two-three”; 6/4 is “one-two-three, four-five-six.” Compare them side by side above.
      </p>
    ),
  },
  {
    question: "What is the difference between 3/2 and 3/4 time signature?",
    answer: (
      <p>
        Both are <strong>simple triple</strong> (three beats per bar), but the <strong>beat unit</strong> is different. In <strong>3/4</strong> the beat is the quarter note—three quarter notes per bar. In <strong>3/2</strong> the beat is the half note—three half notes per bar. So at the same tempo, 3/2 has longer, slower beats; 3/4 has shorter beats. A 3/2 bar is twice as long as a 3/4 bar if both use the same “beat” tempo.
      </p>
    ),
  },
];

const Difference32And64Page: React.FC = () => {
  return (
    <LanguageProvider lang="en">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        lang="en"
        canonicalPath="/time-signature-examples/difference-between-32-and-64"
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{TITLE}</h1>
          <p className="text-base-content/80 mt-2">
            Compare these two time signatures side by side. Press play on each to hear the beat emphasis
            and watch the subdivisions (1 e + a for 3/2, 1 2 3 4 5 6 for 6/4).
          </p>
          <p className="text-base-content/60 text-sm mt-2">
            <Link to="/time-signature-examples" className="link link-primary">
              All time signature examples
            </Link>
            {" · "}
            <Link to="/time-signature-examples/difference-between-34-and-68" className="link link-primary">
              Compare 3/4 and 6/8
            </Link>
            {" · "}
            <Link to="/online-metronome" className="link link-primary">
              Online metronome
            </Link>
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {CONFIGS_32_64.map((config) => (
            <TimeSignatureRow key={config.label} config={config} />
          ))}
        </div>

        <div className="divider my-8" />
        <QandA items={FAQ_ITEMS} title="Frequently asked questions" />
      </div>
    </LanguageProvider>
  );
};

export default Difference32And64Page;
