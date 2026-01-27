import { useMetronome } from "../hooks/useMetronome.tsx";
import React from "react";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";

type TimeSignature = 3 | 4;

const Standard: React.FC = () => {
  const [timeSignature, setTimeSignature] = useLocalStorage<TimeSignature>("timeSignature", 4);
  const { isPlaying, bpm, currentBeat, currentBar, beatsPerBar, toggleMetronome, setBpm } =
    useMetronome({ beatsPerBar: timeSignature });

  return (
    <Layout
      isPlaying={isPlaying}
      bpm={bpm}
      toggleMetronome={toggleMetronome}
      setBpm={setBpm}
    >
      <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
      <StandardStatsDisplay currentBeat={currentBeat} currentBar={currentBar} beatsPerBar={beatsPerBar} />
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

type StatsDisplayProps = {
  currentBeat: number;
  currentBar: number;
  beatsPerBar: number;
};

const StandardStatsDisplay: React.FC<StatsDisplayProps> = ({
  currentBeat,
  currentBar,
  beatsPerBar,
}) => {
  return (
    <div className="bg-neutral-content stats stats-vertical sm:stats-horizontal shadow flex flex-grow max-w-md mx-auto">
      <div className="stat">
        <div className="stat-title">beat</div>
        <div className="stat-value">
          <span className="countdown">{currentBeat}</span>
        </div>
        <div className="stat-desc">out of {beatsPerBar}</div>
      </div>

      <div className="stat">
        <div className="stat-title">bar</div>
        <div className="stat-value">
          <span className="countdown">{currentBar}</span>
        </div>
        <div className="stat-desc">out of {beatsPerBar}</div>
      </div>
    </div>
  );
};
