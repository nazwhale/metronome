import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

type TapTempoProps = {
  onBpmChange: (bpm: number) => void;
};

const MIN_BPM = 40;
const MAX_BPM = 200;
const TAP_RESET_DELAY = 2000; // Reset after 2 seconds of no taps
const MIN_TAPS_FOR_BPM = 2;
const MAX_TAPS_TO_TRACK = 8;

const TapTempo: React.FC<TapTempoProps> = ({ onBpmChange }) => {
  const { t } = useLanguage();
  const [tapCount, setTapCount] = useState(0);
  const tapTimesRef = useRef<number[]>([]);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateBpm = useCallback((times: number[]): number | null => {
    if (times.length < MIN_TAPS_FOR_BPM) return null;

    // Calculate intervals between consecutive taps
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }

    // Calculate average interval
    const avgInterval = intervals.reduce((sum, int) => sum + int, 0) / intervals.length;

    // Convert to BPM (ms to minutes)
    const bpm = Math.round(60000 / avgInterval);

    // Clamp to valid range
    return Math.max(MIN_BPM, Math.min(MAX_BPM, bpm));
  }, []);

  const handleTap = useCallback(() => {
    const now = performance.now();

    // Clear any existing reset timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // Add the new tap time
    const newTapTimes = [...tapTimesRef.current, now];

    // Keep only the most recent taps
    if (newTapTimes.length > MAX_TAPS_TO_TRACK) {
      newTapTimes.shift();
    }

    tapTimesRef.current = newTapTimes;
    setTapCount(newTapTimes.length);

    // Calculate and set BPM if we have enough taps
    const bpm = calculateBpm(newTapTimes);
    if (bpm !== null) {
      onBpmChange(bpm);
    }

    // Set a timeout to reset if no more taps
    resetTimeoutRef.current = setTimeout(() => {
      tapTimesRef.current = [];
      setTapCount(0);
    }, TAP_RESET_DELAY);
  }, [calculateBpm, onBpmChange]);

  // Handle keyboard tap (space bar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on 't' key, avoid conflicts with space for play/pause
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTap]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="btn btn-accent btn-md"
        onClick={handleTap}
        aria-label="Tap to set tempo"
      >
        {t.tapTempo}
      </button>
      <div className="text-sm text-base-content/60">
        {tapCount > 0 ? (
          <span>
            {tapCount} {tapCount !== 1 ? t.taps : t.tap} • {t.pressT}
          </span>
        ) : (
          <span>{t.pressToTap}</span>
        )}
      </div>
    </div>
  );
};

export default TapTempo;
