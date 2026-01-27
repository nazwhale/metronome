import BPMSlider from "./BPMSlider";
import PlayButton from "./PlayButton";
import React, { Dispatch, SetStateAction } from "react";

type PropsT = {
  isPlaying: boolean;
  bpm: number;
  toggleMetronome: () => void;
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
    </div>
  );
};

export default Layout;
