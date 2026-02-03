import { useMetronome } from "../hooks/useMetronome.tsx";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";
import TapTempo from "./TapTempo";
import VolumeControl from "./VolumeControl";
import MuteBarToggle from "./MuteBarToggle";
import QandA, { QAItem } from "../components/QandA";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";
import SEO from "../components/SEO";
import { metronomeTranslations } from "../i18n/translations";
import { LanguageProvider } from "../contexts/LanguageContext";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What does metronome mean?",
    answer: (
      <p>
        The word "metronome" comes from the Greek words "metron" (measure) and "nomos" (law or rule).
        A metronome is a device that produces a steady pulse or click at a consistent tempo, measured
        in <Link to="/dictionary/beat" className="link link-primary">beats</Link> per minute (<Link to="/dictionary/bpm" className="link link-primary">BPM</Link>). Musicians use metronomes to practice keeping steady time and to
        develop their internal sense of rhythm. Modern metronomes can be mechanical, electronic, or
        software-based like this online metronome.
      </p>
    ),
  },
  {
    question: "How fast is 120 BPM?",
    answer: (
      <p>
        120 <Link to="/dictionary/bpm" className="link link-primary">BPM</Link> (<Link to="/dictionary/beat" className="link link-primary">beats</Link> per minute) means there are exactly 2 beats per second, or one beat every
        0.5 seconds. This is considered a moderate, comfortable tempo—roughly the speed of a brisk
        walk or a typical pop song. It's often called "<Link to="/dictionary/allegro" className="link link-primary">Allegro</Link> <Link to="/dictionary/moderato" className="link link-primary">moderato</Link>" in classical music terminology.
        Many popular songs are written around 120 BPM because it feels energetic but not rushed.
      </p>
    ),
  },
  {
    question: "How to tell if a song is in 3/4 or 6/8?",
    answer: (
      <div>
        <p className="mb-2">
          Both 3/4 and 6/8 have a similar "feel" but differ in how <Link to="/dictionary/beat" className="link link-primary">beats</Link> are grouped:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>3/4 time</strong> has 3 beats per <Link to="/dictionary/bar" className="link link-primary">measure</Link>, each beat divided into 2. Count: "1-and-2-and-3-and." Think of a waltz.</li>
          <li><strong>6/8 time</strong> has 2 main beats per measure, each divided into 3. Count: "1-2-3-4-5-6" with emphasis on 1 and 4. Think of a jig.</li>
        </ul>
        <p className="mt-2">
          The key difference: 3/4 feels like THREE beats (waltz), while 6/8 feels like TWO beats with a triplet swing.
        </p>
      </div>
    ),
  },
  {
    question: "What are the 4 types of tempo?",
    answer: (
      <div>
        <p className="mb-2">
          Tempo is broadly categorized into four main types:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Slow (<Link to="/dictionary/largo" className="link link-primary">Largo</Link>, <Link to="/dictionary/adagio" className="link link-primary">Adagio</Link>)</strong> – Below 80 <Link to="/dictionary/bpm" className="link link-primary">BPM</Link>. Stately, relaxed, or somber music.</li>
          <li><strong>Moderate (<Link to="/dictionary/andante" className="link link-primary">Andante</Link>, <Link to="/dictionary/moderato" className="link link-primary">Moderato</Link>)</strong> – 80-120 BPM. Walking pace, comfortable and natural.</li>
          <li><strong>Fast (<Link to="/dictionary/allegro" className="link link-primary">Allegro</Link>, <Link to="/dictionary/vivace" className="link link-primary">Vivace</Link>)</strong> – 120-168 BPM. Lively, energetic, upbeat music.</li>
          <li><strong>Very Fast (<Link to="/dictionary/presto" className="link link-primary">Presto</Link>, <Link to="/dictionary/prestissimo" className="link link-primary">Prestissimo</Link>)</strong> – Above 168 BPM. Extremely quick, exciting, virtuosic.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Did Beethoven invent the metronome?",
    answer: (
      <p>
        No, Beethoven did not invent the metronome. The modern metronome was invented by Johann Maelzel
        in 1815, though the concept was developed earlier by Dietrich Nikolaus Winkel. However, Beethoven
        was one of the first major composers to embrace the metronome, adding metronome markings to his
        compositions. He saw it as a way to ensure his music would be performed at the tempos he intended,
        though some of his markings are debated by scholars today.
      </p>
    ),
  },
  {
    question: "When were metronomes invented?",
    answer: (
      <p>
        The mechanical metronome as we know it was patented by Johann Maelzel in 1815, though Dietrich
        Nikolaus Winkel actually invented the double-weighted pendulum mechanism around 1814. Earlier
        devices for measuring musical time existed—Étienne Loulié created a simple pendulum device in
        1696. The metronome quickly became an essential tool for musicians, and by the early 1800s,
        composers began including BPM markings in their scores.
      </p>
    ),
  },
  {
    question: "What are the main types of metronome?",
    answer: (
      <div>
        <p className="mb-2">There are several types of metronomes available today:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Mechanical metronomes</strong> – The classic wind-up pendulum style. Visual and audible, no batteries needed.</li>
          <li><strong>Digital/Electronic metronomes</strong> – Battery-powered devices with precise timing and extra features like subdivision and accent patterns.</li>
          <li><strong>Software/App metronomes</strong> – Free or paid apps for phones and computers, often with advanced features.</li>
          <li><strong>Online metronomes</strong> – Browser-based tools (like this one!) that require no download.</li>
        </ul>
      </div>
    ),
  },
];

type TimeSignature = 3 | 4 | 5;

// Helper to create default accents (beat 1 accented, rest unaccented)
const createDefaultAccents = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => i === 0);

export type StandardMetronomeProps = {
  initialBpm?: number;
  initialTimeSignature?: TimeSignature;
};

const Standard: React.FC<StandardMetronomeProps> = ({
  initialBpm,
  initialTimeSignature
}) => {
  const isEmbed = useIsEmbed();
  const [timeSignature, setTimeSignature] = useLocalStorage<TimeSignature>(
    "timeSignature",
    initialTimeSignature ?? 4
  );
  const [muteAlternatingBars, setMuteAlternatingBars] = useLocalStorage("muteAlternatingBars", false);
  const [playBars, setPlayBars] = useLocalStorage("playBars", 1);
  const [muteBars, setMuteBars] = useLocalStorage("muteBars", 1);
  const [accents, setAccents] = useLocalStorage<boolean[]>(
    "beatAccents",
    createDefaultAccents(initialTimeSignature ?? 4)
  );

  // Adjust accents array when time signature changes
  useEffect(() => {
    if (accents.length !== timeSignature) {
      const newAccents = createDefaultAccents(timeSignature);
      // Preserve existing accent settings where possible
      for (let i = 0; i < Math.min(accents.length, timeSignature); i++) {
        newAccents[i] = accents[i];
      }
      setAccents(newAccents);
    }
  }, [timeSignature, accents, setAccents]);

  const { isPlaying, bpm, currentBeat, beatsPerBar, isBarMuted, toggleMetronome, setBpm } =
    useMetronome({ beatsPerBar: timeSignature, muteAlternatingBars, playBars, muteBars, accents, initialBpm });

  const handleAccentToggle = (beatIndex: number) => {
    const newAccents = [...accents];
    newAccents[beatIndex] = !newAccents[beatIndex];
    setAccents(newAccents);
  };

  return (
    <LanguageProvider lang="en">
      {/* SEO with hreflang tags - only on main page, not embeds */}
      {!isEmbed && (
        <SEO
          title={metronomeTranslations.en.title}
          description={metronomeTranslations.en.description}
          lang="en"
          canonicalPath="/online-metronome"
          translatedPage="metronome"
        />
      )}

      <Layout
        isPlaying={isPlaying}
        bpm={bpm}
        toggleMetronome={toggleMetronome}
        setBpm={setBpm}
        currentBeat={currentBeat}
        beatsPerBar={beatsPerBar}
        accents={accents}
        onAccentToggle={handleAccentToggle}
      >
        <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
        <MuteBarToggle
          enabled={muteAlternatingBars}
          onChange={setMuteAlternatingBars}
          isBarMuted={isBarMuted}
          playBars={playBars}
          muteBars={muteBars}
          onPlayBarsChange={setPlayBars}
          onMuteBarsChange={setMuteBars}
        />
        <TapTempo onBpmChange={setBpm} />
        <VolumeControl />
        {!isEmbed && (
          <EmbedButton
            embedPath="/embed/metronome"
            canonicalPath="/online-metronome"
            queryParams={{ bpm, ts: timeSignature }}
            height={360}
            toolName="Metronome"
          />
        )}
      </Layout>

      {/* FAQ Section - hidden in embed mode */}
      {!isEmbed && (
        <div className="max-w-lg mx-auto px-4 mt-8">
          <div className="divider" />
          <QandA items={FAQ_ITEMS} />
        </div>
      )}
    </LanguageProvider>
  );
};

type TimeSignatureSelectorProps = {
  value: TimeSignature;
  onChange: (value: TimeSignature) => void;
};

const TimeSignatureSelector: React.FC<TimeSignatureSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex justify-center gap-2">
      <button
        className={`btn ${value === 3 ? "btn-primary" : "btn-outline"}`}
        onClick={() => onChange(3)}
      >
        3/4
      </button>
      <button
        className={`btn ${value === 4 ? "btn-primary" : "btn-outline"}`}
        onClick={() => onChange(4)}
      >
        4/4
      </button>
      <button
        className={`btn ${value === 5 ? "btn-primary" : "btn-outline"}`}
        onClick={() => onChange(5)}
      >
        5/4
      </button>
    </div>
  );
};

export default Standard;
