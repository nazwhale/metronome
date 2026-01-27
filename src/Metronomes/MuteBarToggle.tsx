import React from "react";

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
        <span className="label-text">Play</span>
        <input
          type="number"
          min={1}
          max={16}
          value={playBars}
          onChange={(e) => handleNumberChange(e.target.value, onPlayBarsChange)}
          className="input input-bordered input-sm w-16 text-center"
          disabled={!enabled}
        />
        <span className="label-text">bar{playBars !== 1 ? "s" : ""} / Mute</span>
        <input
          type="number"
          min={1}
          max={16}
          value={muteBars}
          onChange={(e) => handleNumberChange(e.target.value, onMuteBarsChange)}
          className="input input-bordered input-sm w-16 text-center"
          disabled={!enabled}
        />
        <span className="label-text">bar{muteBars !== 1 ? "s" : ""}</span>
        <input
          type="checkbox"
          className="toggle toggle-primary ml-2"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
      {enabled && (
        <div className={`badge ${isBarMuted ? "badge-warning" : "badge-success"}`}>
          {isBarMuted ? "Muted bar" : "Playing bar"}
        </div>
      )}
    </div>
  );
};

export default MuteBarToggle;
