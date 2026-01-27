import { useMetronome } from "../hooks/useMetronome.tsx";
import React from "react";
import Layout from "./Layout.tsx";
import { useLocalStorage } from "usehooks-ts";
import BeatDots from "./BeatDots";
import TapTempo from "./TapTempo";
import VolumeControl from "./VolumeControl";
import MuteBarToggle from "./MuteBarToggle";

type TimeSignature = 3 | 4;

const Standard: React.FC = () => {
  const [timeSignature, setTimeSignature] = useLocalStorage<TimeSignature>("timeSignature", 4);
  const [muteAlternatingBars, setMuteAlternatingBars] = useLocalStorage("muteAlternatingBars", false);
  const [playBars, setPlayBars] = useLocalStorage("playBars", 1);
  const [muteBars, setMuteBars] = useLocalStorage("muteBars", 1);
  const { isPlaying, bpm, currentBeat, beatsPerBar, isBarMuted, toggleMetronome, setBpm } =
    useMetronome({ beatsPerBar: timeSignature, muteAlternatingBars, playBars, muteBars });

  return (
    <Layout
      isPlaying={isPlaying}
      bpm={bpm}
      toggleMetronome={toggleMetronome}
      setBpm={setBpm}
    >
      <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
      <BeatDots currentBeat={currentBeat} beatsPerBar={beatsPerBar} />
      <MuteBarToggle 
        enabled={muteAlternatingBars} 
        onChange={setMuteAlternatingBars}
        isBarMuted={isBarMuted}
        playBars={playBars}
        muteBars={muteBars}
        onPlayBarsChange={setPlayBars}
        onMuteBarsChange={setMuteBars}
      />
      <TapTempo onBpmChange={setBpm} />
      <VolumeControl />
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
