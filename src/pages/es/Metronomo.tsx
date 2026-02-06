import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useMetronome } from "../../hooks/useMetronome";
import { ALLOWED_BPM_VALUES } from "../BpmMetronomePage";
import Layout from "../../Metronomes/Layout";
import TapTempo from "../../Metronomes/TapTempo";
import VolumeControl from "../../Metronomes/VolumeControl";
import MuteBarToggle from "../../Metronomes/MuteBarToggle";
import QandA, { QAItem } from "../../components/QandA";
import SEO from "../../components/SEO";
import { metronomeTranslations, uiTranslations, tempoLinksCopy } from "../../i18n/translations";
import { LanguageProvider } from "../../contexts/LanguageContext";
import type { HreflangUrls } from "../../components/SEO";

// Spanish FAQ items
const FAQ_ITEMS: QAItem[] = metronomeTranslations.es.faq.map((item) => ({
  question: item.question,
  answer: <p>{item.answer}</p>,
}));

type TimeSignature = 3 | 4 | 5;

// Helper to create default accents (beat 1 accented, rest unaccented)
const createDefaultAccents = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => i === 0);

export type MetronomoProps = {
  initialBpm?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalPathOverride?: string;
  hreflangUrls?: HreflangUrls;
  pageTitle?: string;
  pageSubheading?: string;
};

const Metronomo: React.FC<MetronomoProps> = ({
  initialBpm,
  seoTitle,
  seoDescription,
  canonicalPathOverride,
  hreflangUrls,
  pageTitle,
  pageSubheading,
} = {}) => {
  const [timeSignature, setTimeSignature] = useLocalStorage<TimeSignature>(
    "timeSignature",
    4
  );
  const [muteAlternatingBars, setMuteAlternatingBars] = useLocalStorage(
    "muteAlternatingBars",
    false
  );
  const [playBars, setPlayBars] = useLocalStorage("playBars", 1);
  const [muteBars, setMuteBars] = useLocalStorage("muteBars", 1);
  const [accents, setAccents] = useLocalStorage<boolean[]>(
    "beatAccents",
    createDefaultAccents(4)
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

  const {
    isPlaying,
    bpm,
    currentBeat,
    beatsPerBar,
    isBarMuted,
    toggleMetronome,
    setBpm,
  } = useMetronome({
    beatsPerBar: timeSignature,
    muteAlternatingBars,
    playBars,
    muteBars,
    accents,
    initialBpm,
  });

  const handleAccentToggle = (beatIndex: number) => {
    const newAccents = [...accents];
    newAccents[beatIndex] = !newAccents[beatIndex];
    setAccents(newAccents);
  };

  return (
    <LanguageProvider lang="es">
      <SEO
        title={seoTitle ?? metronomeTranslations.es.title}
        description={seoDescription ?? metronomeTranslations.es.description}
        lang="es"
        canonicalPath={canonicalPathOverride ?? "/es/metronomo"}
        translatedPage={canonicalPathOverride ? undefined : "metronome"}
        hreflangUrls={hreflangUrls}
      />

      {(pageTitle ?? pageSubheading) && (
        <div className="text-center mb-6">
          {pageTitle && (
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
          )}
          {pageSubheading && (
            <p className="text-base-content/70 mt-2">{pageSubheading}</p>
          )}
          <p className="mt-2">
            <Link to="/es/metronomo" className="link link-primary text-sm">
              {tempoLinksCopy.es.allTempos}
            </Link>
          </p>
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
        {!canonicalPathOverride && (
          <p className="text-center text-base-content/80 text-sm">
            {tempoLinksCopy.es.setTempoLabel}{" "}
            {ALLOWED_BPM_VALUES.map((b) => (
              <React.Fragment key={b}>
                <Link to={`/es/metronomo/${b}-bpm`} className="link link-primary font-medium">
                  {b}
                </Link>
                {b !== ALLOWED_BPM_VALUES[ALLOWED_BPM_VALUES.length - 1] ? " · " : ""}
              </React.Fragment>
            ))}{" "}
            BPM
          </p>
        )}
      </Layout>

      {/* FAQ Section */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="divider" />
        <QandA items={FAQ_ITEMS} title={uiTranslations.es.faqTitle} />
      </div>
    </LanguageProvider>
  );
};

type TimeSignatureSelectorProps = {
  value: TimeSignature;
  onChange: (value: TimeSignature) => void;
};

const TimeSignatureSelector: React.FC<TimeSignatureSelectorProps> = ({
  value,
  onChange,
}) => {
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

export default Metronomo;
