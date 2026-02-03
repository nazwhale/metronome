import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useMetronome } from "../../hooks/useMetronome";
import Layout from "../../Metronomes/Layout";
import TapTempo from "../../Metronomes/TapTempo";
import VolumeControl from "../../Metronomes/VolumeControl";
import MuteBarToggle from "../../Metronomes/MuteBarToggle";
import QandA, { QAItem } from "../../components/QandA";
import SEO from "../../components/SEO";
import { metronomeTranslations, uiTranslations } from "../../i18n/translations";
import { LanguageProvider } from "../../contexts/LanguageContext";

// Spanish FAQ items
const FAQ_ITEMS: QAItem[] = metronomeTranslations.es.faq.map((item) => ({
  question: item.question,
  answer: <p>{item.answer}</p>,
}));

type TimeSignature = 3 | 4 | 5;

// Helper to create default accents (beat 1 accented, rest unaccented)
const createDefaultAccents = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => i === 0);

const Metronomo: React.FC = () => {
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
  });

  const handleAccentToggle = (beatIndex: number) => {
    const newAccents = [...accents];
    newAccents[beatIndex] = !newAccents[beatIndex];
    setAccents(newAccents);
  };

  return (
    <LanguageProvider lang="es">
      <SEO
        title={metronomeTranslations.es.title}
        description={metronomeTranslations.es.description}
        lang="es"
        canonicalPath="/es/metronomo"
        translatedPage="metronome"
      />

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
