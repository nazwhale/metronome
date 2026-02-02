import { useMetronome } from "../hooks/useMetronome.tsx";
import React, { useEffect } from "react";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";
import TapTempo from "./TapTempo";
import VolumeControl from "./VolumeControl";
import MuteBarToggle from "./MuteBarToggle";
import QandA, { QAItem } from "../components/QandA";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What does metronome mean?",
    answer: (
      <p>
        The word "metronome" comes from the Greek words "metron" (measure) and "nomos" (law or rule).
        A metronome is a device that produces a steady pulse or click at a consistent tempo, measured
        in beats per minute (BPM). Musicians use metronomes to practice keeping steady time and to
        develop their internal sense of rhythm. Modern metronomes can be mechanical, electronic, or
        software-based like this online metronome.
      </p>
    ),
  },
  {
    question: "How fast is 120 BPM?",
    answer: (
      <p>
        120 BPM (beats per minute) means there are exactly 2 beats per second, or one beat every
        0.5 seconds. This is considered a moderate, comfortable tempo—roughly the speed of a brisk
        walk or a typical pop song. It's often called "Allegro moderato" in classical music terminology.
        Many popular songs are written around 120 BPM because it feels energetic but not rushed.
      </p>
    ),
  },
  {
    question: "How to tell if a song is in 3/4 or 6/8?",
    answer: (
      <div>
        <p className="mb-2">
          Both 3/4 and 6/8 have a similar "feel" but differ in how beats are grouped:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>3/4 time</strong> has 3 beats per measure, each beat divided into 2. Count: "1-and-2-and-3-and." Think of a waltz.</li>
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
          <li><strong>Slow (Largo, Adagio)</strong> – Below 80 BPM. Stately, relaxed, or somber music.</li>
          <li><strong>Moderate (Andante, Moderato)</strong> – 80-120 BPM. Walking pace, comfortable and natural.</li>
          <li><strong>Fast (Allegro, Vivace)</strong> – 120-168 BPM. Lively, energetic, upbeat music.</li>
          <li><strong>Very Fast (Presto, Prestissimo)</strong> – Above 168 BPM. Extremely quick, exciting, virtuosic.</li>
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
  // #region agent log
  let localStorageWorks = false;
  try { localStorage.setItem('__test__', '1'); localStorage.removeItem('__test__'); localStorageWorks = true; } catch (e) { localStorageWorks = false; }
  fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Standard.tsx:init',message:'Standard component init',data:{isEmbed,localStorageWorks,initialBpm,initialTimeSignature},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6'})}).catch(()=>{});
  // #endregion
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
    <>
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
    </>
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
