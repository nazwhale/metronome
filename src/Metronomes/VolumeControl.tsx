import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { useLocalStorage } from "usehooks-ts";

const MIN_DB = -40;
const MAX_DB = 0;

const VolumeControl: React.FC = () => {
  // Store volume as a percentage (0-100) for easier UX
  const [volumePercent, setVolumePercent] = useLocalStorage("metronomeVolume", 80);
  const [isMuted, setIsMuted] = useState(false);

  // Convert percentage to decibels
  const percentToDb = (percent: number): number => {
    if (percent === 0) return -Infinity;
    // Linear mapping from 0-100 to MIN_DB-MAX_DB
    return MIN_DB + (percent / 100) * (MAX_DB - MIN_DB);
  };

  // Apply volume to Tone.js destination
  useEffect(() => {
    if (isMuted) {
      Tone.Destination.volume.value = -Infinity;
    } else {
      Tone.Destination.volume.value = percentToDb(volumePercent);
    }
  }, [volumePercent, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolumePercent(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getVolumeIcon = () => {
    if (isMuted || volumePercent === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      );
    }
    if (volumePercent < 50) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-3 justify-center">
      <button
        className="btn btn-ghost btn-sm btn-circle"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={isMuted ? 0 : volumePercent}
        onChange={handleVolumeChange}
        className="range range-sm w-32"
        aria-label="Volume"
      />
      <span className="text-sm text-base-content/60 w-8">
        {isMuted ? 0 : volumePercent}%
      </span>
    </div>
  );
};

export default VolumeControl;
