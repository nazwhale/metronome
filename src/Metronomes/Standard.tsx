import { useMetronome } from "../hooks/useMetronome.tsx";
import React from "react";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";
import BeatDots from "./BeatDots";

type TimeSignature = 3 | 4;

const Standard: React.FC = () => {
  const [timeSignature, setTimeSignature] = useLocalStorage<TimeSignature>("timeSignature", 4);
  const { isPlaying, bpm, currentBeat, beatsPerBar, toggleMetronome, setBpm } =
    useMetronome({ beatsPerBar: timeSignature });

  return (
    <Layout
      isPlaying={isPlaying}
      bpm={bpm}
      toggleMetronome={toggleMetronome}
      setBpm={setBpm}
    >
      <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
      <BeatDots currentBeat={currentBeat} beatsPerBar={beatsPerBar} />
    </Layout>
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
    </div>
  );
};

export default Standard;
