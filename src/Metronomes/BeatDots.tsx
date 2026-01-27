import React from "react";

type BeatDotsProps = {
  currentBeat: number;
  beatsPerBar?: number;
};

const BeatDots: React.FC<BeatDotsProps> = ({ currentBeat, beatsPerBar = 4 }) => {
  return (
    <div className="flex justify-center gap-4 py-2">
      {Array.from({ length: beatsPerBar }, (_, i) => i + 1).map((beat) => (
        <div
          key={beat}
          className={`w-4 h-4 rounded-full transition-all duration-100 ${
            currentBeat === beat
              ? "bg-primary scale-125 shadow-lg shadow-primary/50"
              : "bg-base-300"
          }`}
        />
      ))}
    </div>
  );
};

export default BeatDots;
