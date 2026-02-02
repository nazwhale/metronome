import React from "react";
import StatsDisplay from "./StatsDisplay.tsx";
import { useMetronome } from "../hooks/useMetronome.tsx";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";

// Default: beat 1 accented, rest unaccented
const createDefaultAccents = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => i === 0);

const CircleOfFifths: React.FC = () => {
  const [accents, setAccents] = useLocalStorage<boolean[]>(
    "circleOfFifthsAccents",
    createDefaultAccents(4)
  );

  const {
    isPlaying,
    bpm,
    currentBeat,
    beatsPerBar,
    currentBar,
    currentNote,
    nextNote,
    toggleMetronome,
    setBpm,
  } = useMetronome({ updateNoteEveryFourBars: true, accents });

  const handleAccentToggle = (beatIndex: number) => {
    const newAccents = [...accents];
    newAccents[beatIndex] = !newAccents[beatIndex];
    setAccents(newAccents);
  };

  return (
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
      <StatsDisplay
        currentNote={currentNote}
        nextNote={nextNote}
        currentBar={currentBar}
      />
    </Layout>
  );
};

export default CircleOfFifths;
