import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

type MuteBarToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  isBarMuted?: boolean;
  playBars: number;
  muteBars: number;
  onPlayBarsChange: (value: number) => void;
  onMuteBarsChange: (value: number) => void;
};

const MuteBarToggle: React.FC<MuteBarToggleProps> = ({ 
  enabled, 
  onChange, 
  isBarMuted,
  playBars,
  muteBars,
  onPlayBarsChange,
  onMuteBarsChange,
}) => {
  const { t } = useLanguage();
  
  const handleNumberChange = (
    value: string, 
    setter: (value: number) => void
  ) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 16) {
      setter(num);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="label-text">{t.play}</span>
        <input
          type="number"
          min={1}
          max={16}
          value={playBars}
          onChange={(e) => handleNumberChange(e.target.value, onPlayBarsChange)}
          className="input input-bordered input-sm w-16 text-center"
          disabled={!enabled}
        />
        <span className="label-text">{playBars !== 1 ? t.bars : t.bar} / {t.mute}</span>
        <input
          type="number"
          min={1}
          max={16}
          value={muteBars}
          onChange={(e) => handleNumberChange(e.target.value, onMuteBarsChange)}
          className="input input-bordered input-sm w-16 text-center"
          disabled={!enabled}
        />
        <span className="label-text">{muteBars !== 1 ? t.bars : t.bar}</span>
        <input
          type="checkbox"
          className="toggle toggle-primary ml-2"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      {enabled && (
        <div className={`badge ${isBarMuted ? "badge-warning" : "badge-success"}`}>
          {isBarMuted ? t.mutedBar : t.playingBar}
        </div>
      )}
    </div>
  );
};

export default MuteBarToggle;
