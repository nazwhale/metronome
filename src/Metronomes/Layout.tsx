import BPMSlider from "./BPMSlider";
import PlayButton from "./PlayButton";
import Timer from "./Timer";
import React, { Dispatch, SetStateAction } from "react";

type PropsT = {
  isPlaying: boolean;
  bpm: number;
  toggleMetronome: (
    event: React.MouseEvent | React.TouchEvent,
  ) => Promise<void>;
  setBpm: Dispatch<SetStateAction<number>>;
  children: React.ReactNode;
};

const Layout = ({
  isPlaying,
  bpm,
  toggleMetronome,
  setBpm,
  children, // Accept children here
}: PropsT) => {
  return (
    <div className="space-y-8">
      <BPMSlider bpm={bpm} setBpm={setBpm} />
      {children} {/* Render children */}
      <PlayButton isPlaying={isPlaying} onToggle={toggleMetronome} />
      <Timer isPlaying={isPlaying} />
    </div>
  );
};

export default Layout;
