import React from "react";
import BeatDots from "./BeatDots";

type StatsDisplayProps = {
  currentNote: string;
  nextNote: string;
  currentBeat: number;
  currentBar: number;
};

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  currentNote,
  nextNote,
  currentBeat,
  currentBar,
}) => {
  return (
    <div className="space-y-4">
      <BeatDots currentBeat={currentBeat} />
      
      <div className="bg-neutral-content stats stats-vertical sm:stats-horizontal shadow flex flex-grow max-w-md mx-auto">
        <div className="stat">
          <div className="stat-title">note</div>
          <div className="stat-value">{currentNote}</div>
          <div className="stat-desc">next up: {nextNote}</div>
        </div>

        <div className="stat">
          <div className="stat-title">bar</div>
          <div className="stat-value">
            <span className="countdown">{currentBar}</span>
          </div>
          <div className="stat-desc">next note after 4</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
