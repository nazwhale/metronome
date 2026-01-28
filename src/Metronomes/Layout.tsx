import BPMSlider from "./BPMSlider";
import PlayButton from "./PlayButton";
import React, { Dispatch, SetStateAction } from "react";

type PropsT = {
  isPlaying: boolean;
  bpm: number;
  toggleMetronome: () => void;
  setBpm: Dispatch<SetStateAction<number>>;
  topContent?: React.ReactNode;
  children?: React.ReactNode;
};

const Layout = ({
  isPlaying,
  bpm,
  toggleMetronome,
  setBpm,
  topContent,
  children,
}: PropsT) => {
  return (
    <div className="flex flex-col items-center gap-8">
      {topContent && <div>{topContent}</div>}
      <BPMSlider bpm={bpm} setBpm={setBpm} />
      {children && <div className="flex flex-col items-center gap-8 w-full">{children}</div>}
      <PlayButton isPlaying={isPlaying} onToggle={toggleMetronome} />
    </div>
  );
};

export default Layout;
