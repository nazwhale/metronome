import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

type PropsT = {
  isPlaying: boolean;
  onToggle: (event: React.MouseEvent | React.TouchEvent) => void;
};

const PlayButton: React.FC<PropsT> = ({ isPlaying, onToggle }) => {
  const { t } = useLanguage();
  
  const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault(); // Useful for preventing default button behavior
    onToggle(event);
  };

  return (
    <button
      className={`btn-lg w-48 btn btn-active ${
        isPlaying ? "btn-accent" : "btn-primary"
      }`}
      onClick={handleInteraction}
    >
      {isPlaying ? t.stop : t.start}
    </button>
  );
};

export default PlayButton;
