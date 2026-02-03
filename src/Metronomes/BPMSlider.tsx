import React, { ChangeEvent } from "react";
import { useLanguage } from "../contexts/LanguageContext";

type BPMSliderProps = {
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
};

const BPMSlider: React.FC<BPMSliderProps> = ({ bpm, setBpm }) => {
  const { t } = useLanguage();
  
  const onBpmChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center w-fit">
        <button className="btn btn-secondary" onClick={() => setBpm(bpm - 5)}>
          -5
        </button>
        <div className="stat">
          <div className="stat-title">{t.bpm}</div>
          <div className="stat-value">{bpm}</div>
          <div className="stat-desc">
            {t.every} {calculateInterval(bpm).toFixed(2)}s
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => setBpm(bpm + 5)}>
          +5
        </button>
      </div>

      <input
        type="range"
        min={40}
        max={200}
        value={bpm}
        className="range"
        onChange={onBpmChange}
      />
    </div>
  );
};

function calculateInterval(bpm: number): number {
  return 60 / bpm;
}

export default BPMSlider;
