import BPMSlider from "./BPMSlider";
import PlayButton from "./PlayButton";
import BeatDots from "./BeatDots";
import React, { Dispatch, SetStateAction } from "react";

type PropsT = {
  isPlaying: boolean;
  bpm: number;
  toggleMetronome: () => void;
  setBpm: Dispatch<SetStateAction<number>>;
  currentBeat: number;
  beatsPerBar: number;
  accents: boolean[];
  onAccentToggle: (beatIndex: number) => void;
  children?: React.ReactNode;
};

const Layout = ({
  isPlaying,
  bpm,
  toggleMetronome,
  setBpm,
  currentBeat,
  beatsPerBar,
  accents,
  onAccentToggle,
  children,
}: PropsT) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <BeatDots
          currentBeat={currentBeat}
          beatsPerBar={beatsPerBar}
          accents={accents}
          onAccentToggle={onAccentToggle}
        />
        <BPMSlider bpm={bpm} setBpm={setBpm} />
      </div>
      {children && <div className="flex flex-col items-center gap-8 w-full">{children}</div>}
      <PlayButton isPlaying={isPlaying} onToggle={toggleMetronome} />
    </div>
  );
};

export default Layout;
