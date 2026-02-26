import { useMetronome } from "../hooks/useMetronome.tsx";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";
import TapTempo from "./TapTempo";
import VolumeControl from "./VolumeControl";
import MuteBarToggle from "./MuteBarToggle";
import QandA, { QAItem } from "../components/QandA";
import ToolPracticeGuide from "../components/ToolPracticeGuide";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";
import SEO, { HreflangUrls } from "../components/SEO";
import WebApplicationSchema from "../components/WebApplicationSchema";
import { BASE_URL } from "../i18n/translations";
import { metronomeTranslations, tempoLinksCopy } from "../i18n/translations";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ALLOWED_BPM_VALUES } from "../pages/BpmMetronomePage";

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
  /** When set (e.g. for /online-metronome/100-bpm routes), overrides default SEO and hreflang */
  seoTitle?: string;
  seoDescription?: string;
  canonicalPathOverride?: string;
  hreflangUrls?: HreflangUrls;
  /** Optional hero title and subheading (e.g. "Practice at 100 BPM") */
  pageTitle?: string;
  pageSubheading?: string;
};

const Standard: React.FC<StandardMetronomeProps> = ({
  initialBpm,
  initialTimeSignature,
  seoTitle,
  seoDescription,
  canonicalPathOverride,
  hreflangUrls,
  pageTitle,
  pageSubheading,
}) => {
  const isEmbed = useIsEmbed();
  // /online-metronome is the canonical URL for metronome intent; homepage (/) is the tools hub.
  const canonicalPath = canonicalPathOverride ?? "/online-metronome";
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
        <>
          <SEO
            title={seoTitle ?? metronomeTranslations.en.title}
            description={seoDescription ?? metronomeTranslations.en.description}
            lang="en"
            canonicalPath={canonicalPath}
            translatedPage={canonicalPathOverride ? undefined : "metronome"}
            hreflangUrls={hreflangUrls}
          />
          <WebApplicationSchema
            name="TempoTick Online Metronome"
            url={`${BASE_URL}/online-metronome`}
            description="Free online metronome with time signatures, accents, mute bars and tap tempo for practice."
            applicationCategory="MusicApplication"
          />
        </>
      )}

      {!isEmbed && (
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{pageTitle ?? "Online metronome"}</h1>
          {pageSubheading && (
            <p className="text-base-content/70 mt-2">{pageSubheading}</p>
          )}
          {pageTitle && (
            <p className="mt-2">
              <Link to="/online-metronome" className="link link-primary text-sm">
                {tempoLinksCopy.en.allTempos}
              </Link>
            </p>
          )}
        </div>
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
        {!isEmbed && !canonicalPathOverride && (
          <p className="text-center text-base-content/80 text-sm">
            {tempoLinksCopy.en.setTempoLabel}{" "}
            {ALLOWED_BPM_VALUES.map((b) => (
              <React.Fragment key={b}>
                <Link to={`/online-metronome/${b}-bpm`} className="link link-primary font-medium">
                  {b}
                </Link>
                {b !== ALLOWED_BPM_VALUES[ALLOWED_BPM_VALUES.length - 1] ? " · " : ""}
              </React.Fragment>
            ))}{" "}
            BPM
          </p>
        )}
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

      {/* Practice guide & FAQ - hidden in embed mode */}
      {!isEmbed && (
        <div className="max-w-lg mx-auto px-4 mt-8">
          <div className="divider" />
          <ToolPracticeGuide
            title="Practice with the online metronome"
            features={[
              "Tap tempo — set BPM by tapping the button or pressing T",
              "Time signatures — 3/4, 4/4, and 5/4",
              "Beat accents — accent any beat in the bar",
              "Play bar / Mute bar — alternate playing and silent bars to train your internal pulse",
              "Volume control",
              "Free — no ads, no download",
            ]}
            howToUseSteps={[
              "Set your BPM with the slider or use Tap tempo (button or T key) to match a song or internal pulse.",
              "Choose a time signature (3/4, 4/4, or 5/4) to match the music you’re practising.",
              "Optionally set beat accents (click the beat circles) or enable Play bar / Mute bar for silent-bar practice.",
              "Press play and practise with the click. Start at a comfortable tempo, then slow down to fix timing issues.",
              "Use mute bars to check you keep time when the click is silent—increase mute bars as you get more confident.",
            ]}
            exampleRoutine={
              <>
                <p className="m-0">
                  <strong>Warm-up (2–3 min):</strong> Set 60–80 BPM in 4/4. Play scales or a simple pattern; focus on landing exactly on the click.
                </p>
                <p className="m-0">
                  <strong>Main (10–15 min):</strong> Set the metronome to the tempo of a piece or exercise. Play through; if you rush or drag, lower the BPM and repeat until it’s steady.
                </p>
                <p className="m-0">
                  <strong>Internal pulse (5 min):</strong> Enable Play bar / Mute bar (e.g. 1 bar play, 1 bar mute). Keep playing in time during the silent bars. Increase mute bars as you improve.
                </p>
              </>
            }
            settingsExplained={
              <>
                <p className="m-0">
                  <strong>BPM:</strong> Beats per minute. Use the slider or tap tempo to set the speed. Slower tempos help fix timing; increase gradually as you get steadier.
                </p>
                <p className="m-0 mt-1.5">
                  <strong>Time signature:</strong> 3/4 (three beats per bar), 4/4 (four), or 5/4 (five). Match the metre of the music you’re practising.
                </p>
                <p className="m-0 mt-1.5">
                  <strong>Beat accents:</strong> Click a beat number to accent it (louder click). Useful for emphasising the downbeat or other beats in the bar.
                </p>
                <p className="m-0 mt-1.5">
                  <strong>Play bar / Mute bar:</strong> Play a set number of bars with the click, then the same number silent. Tests whether you can keep time without the click.
                </p>
              </>
            }
            otherTools={[
              { path: "/speed-trainer-metronome", name: "Speed trainer metronome" },
              { path: "/guitar-triad-trainer", name: "Guitar triad trainer" },
            ]}
          />
          <div className="divider my-8" />
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
