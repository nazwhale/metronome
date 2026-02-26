import React from "react";
import { Link } from "react-router-dom";
import { LanguageProvider } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import QandA, { QAItem } from "../components/QandA";
import { TimeSignatureRow } from "./TimeSignatureRow";
import { TIME_SIGNATURE_CONFIGS } from "./data";

const TITLE = "Time signature examples";
const DESCRIPTION =
  "Compare time signatures with a visual metronome: simple and compound, duple, triple and quadruple. See beat emphasis and subdivisions (1 e + a, etc.) in real time.";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What are 5 examples of time signatures?",
    answer: (
      <p>
        Five common examples are <strong>2/4</strong> (two quarter beats per bar, e.g. marches),{" "}
        <strong>3/4</strong> (three quarter beats, waltz), <strong>4/4</strong> (four quarter beats, common time),{" "}
        <strong>6/8</strong> (two dotted-quarter beats, compound duple), and <strong>5/4</strong> (five quarter beats, e.g. “Take Five”). Try the examples above to hear and see how each one feels.
      </p>
    ),
  },
  {
    question: "What are the four types of time signatures?",
    answer: (
      <p>
        Time signatures are often grouped by how many main beats per bar and how each beat divides. Common “types” are:{" "}
        <strong>simple duple</strong> (2 beats, e.g. 2/4, 2/2), <strong>simple triple</strong> (3 beats, e.g. 3/4, 3/8),{" "}
        <strong>simple quadruple</strong> (4 beats, e.g. 4/4, 4/2), and <strong>compound</strong> (beats divide in three, e.g. 6/8, 9/8, 12/8). This page shows all of these with beat emphasis and subdivisions.
      </p>
    ),
  },
  {
    question: "What is 6/8 time signature?",
    answer: (
      <p>
        6/8 is a <strong>compound duple</strong> time signature: two main beats per bar, each beat a dotted quarter note that divides into three eighth notes. You count “1-2-3-4-5-6” with emphasis on 1 and 4. It feels like two big beats, not six small ones—common in ballads, folk, and rock (e.g. “House of the Rising Sun,” “Norwegian Wood”). Use the 6/8 row above to hear and see it.
      </p>
    ),
  },
  {
    question: "What is a 4/4 time signature called?",
    answer: (
      <p>
        4/4 is called <strong>common time</strong> (sometimes written as “C”). It has four quarter-note beats per bar and is the most common time signature in pop, rock, and most Western music.
      </p>
    ),
  },
  {
    question: "Are 2/2 and 4/4 the same time signature?",
    answer: (
      <p>
        No. Both have four quarter notes’ worth of time per bar, but the <strong>beat unit</strong> is different. In <strong>4/4</strong> the beat is the quarter note (you feel 4 beats). In <strong>2/2</strong> (alla breve or “cut time”) the beat is the half note (you feel 2 beats). So at the same tempo, 2/2 feels like two slower, longer beats; 4/4 feels like four. Compare the 2/4 and 2/2 examples above to hear the difference.
      </p>
    ),
  },
  {
    question: "What's the most popular time signature?",
    answer: (
      <p>
        <strong>4/4</strong> (common time) is by far the most popular. Most pop, rock, hip-hop, and electronic music is in 4/4. Other common ones are 3/4 (waltzes, ballads) and 6/8 (ballads, folk, some rock).
      </p>
    ),
  },
  {
    question: "What is the fastest BPM song ever?",
    answer: (
      <p>
        “Fastest” depends on how you measure (e.g. note rate vs. beat rate). Some extreme metal or electronic tracks go well over 200 BPM; “Thousand” by Moby has been cited around 1000 BPM in terms of very fast subdivisions. For practice, most music sits between about 60 and 180 BPM. Use the <Link to="/online-metronome" className="link link-primary">online metronome</Link> to set any tempo.
      </p>
    ),
  },
  {
    question: "Is Poker Face 120 BPM?",
    answer: (
      <p>
        “Poker Face” by Lady Gaga is often listed around <strong>120 BPM</strong>—a common tempo for upbeat pop and dance music. You can use a metronome at 120 BPM to play or sing along and lock in the pulse.
      </p>
    ),
  },
];

const TimeSignatureExamplesPage: React.FC = () => {
  return (
    <LanguageProvider lang="en">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        lang="en"
        canonicalPath="/time-signature-examples"
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{TITLE}</h1>
          <p className="text-base-content/80 mt-2">
            Each example loops at 72 BPM. Press play to hear the beat emphasis (strong on beat 1)
            and watch the subdivision labels (1 e + a, etc.) highlight in time.
          </p>
          <p className="text-base-content/60 text-sm mt-2">
            <Link to="/online-metronome" className="link link-primary">
              Online metronome
            </Link>{" "}
            ·{" "}
            <Link to="/dictionary" className="link link-primary">
              Musical dictionary
            </Link>
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {TIME_SIGNATURE_CONFIGS.map((config) => (
            <TimeSignatureRow key={config.label} config={config} />
          ))}
        </div>

        <p className="text-base-content/70 text-sm mt-6">
          <Link to="/time-signature-examples/difference-between-34-and-68" className="link link-primary">
            Compare 3/4 and 6/8
          </Link>
          {" · "}
          <Link to="/time-signature-examples/difference-between-32-and-64" className="link link-primary">
            Compare 3/2 and 6/4
          </Link>
          {" — "}side-by-side with FAQs about telling them apart.
        </p>

        <div className="divider my-8" />
        <QandA items={FAQ_ITEMS} title="Frequently asked questions" />
      </div>
    </LanguageProvider>
  );
};

export default TimeSignatureExamplesPage;
