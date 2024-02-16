import React from "react";
import StatsDisplay from "./StatsDisplay.tsx";
import { useMetronome } from "../hooks/useMetronome.tsx";
import Layout from "./Layout.tsx";

const CircleOfFifths: React.FC = () => {
  const {
    isPlaying,
    bpm,
    currentBeat,
    currentBar,
    currentNote,
    nextNote,
    toggleMetronome,
    setBpm,
  } = useMetronome(120, true);

  return (
    <Layout
      isPlaying={isPlaying}
      bpm={bpm}
      toggleMetronome={toggleMetronome}
      setBpm={setBpm}
    >
      <StatsDisplay
        currentNote={currentNote}
        nextNote={nextNote}
        currentBeat={currentBeat}
        currentBar={currentBar}
      />
    </Layout>
  );
};

export default CircleOfFifths;
