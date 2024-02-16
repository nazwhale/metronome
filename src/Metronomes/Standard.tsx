import { useMetronome } from "../hooks/useMetronome.tsx";
import React from "react";
import Layout from "./Layout.tsx";

const Standard: React.FC = () => {
  const { isPlaying, bpm, currentBeat, currentBar, toggleMetronome, setBpm } =
    useMetronome(120);

  return (
    <Layout
      isPlaying={isPlaying}
      bpm={bpm}
      toggleMetronome={toggleMetronome}
      setBpm={setBpm}
    >
      <StandardStatsDisplay currentBeat={currentBeat} currentBar={currentBar} />
    </Layout>
  );
};

export default Standard;

type StatsDisplayProps = {
  currentBeat: number;
  currentBar: number;
};

const StandardStatsDisplay: React.FC<StatsDisplayProps> = ({
  currentBeat,
  currentBar,
}) => {
  return (
    <div className="bg-neutral-content stats stats-vertical sm:stats-horizontal shadow flex flex-grow max-w-md mx-auto">
      <div className="stat">
        <div className="stat-title">beat</div>
        <div className="stat-value">
          <span className="countdown">{currentBeat}</span>
        </div>
        <div className="stat-desc">out of 4</div>
      </div>

      <div className="stat">
        <div className="stat-title">bar</div>
        <div className="stat-value">
          <span className="countdown">{currentBar}</span>
        </div>
        <div className="stat-desc">out of 4</div>
      </div>
    </div>
  );
};
