import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "usehooks-ts";

const BPM_STORAGE_KEY = "bpm";
const DEFAULT_BPM = 120;

/**
 * BPM state with optional URL override (e.g. from /online-metronome/100-bpm).
 * When initialBpm is set, it wins on load over localStorage; user changes update both.
 */
export function useBpmState(initialBpm?: number): [number, Dispatch<SetStateAction<number>>] {
  const [storedBpm, setStoredBpm] = useLocalStorage(BPM_STORAGE_KEY, DEFAULT_BPM);
  const [urlOverride, setUrlOverride] = useState<number | null>(() => initialBpm ?? null);

  useEffect(() => {
    setUrlOverride(initialBpm ?? null);
  }, [initialBpm]);

  const bpm = urlOverride ?? initialBpm ?? storedBpm;

  const setBpm: Dispatch<SetStateAction<number>> = (value) => {
    const next = typeof value === "function" ? value(bpm) : value;
    setStoredBpm(next);
    setUrlOverride(next);
  };

  return [bpm, setBpm];
}
