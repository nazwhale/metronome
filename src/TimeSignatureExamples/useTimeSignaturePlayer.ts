import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import { fourthBeatSynth, weakBeatSynth } from "../synth";
import type { TimeSignatureConfig } from "./data";
import { getTicksPerBar } from "./data";

const DEFAULT_BPM = 72;

/**
 * Returns tick interval in seconds.
 * BPM is quarter-note BPM. For simple time we use sixteenths (quarter/4).
 * For compound we use the subdivision (e.g. eighth in 6/8: 3 quarters per bar / 6 = half quarter = quarter/2).
 */
function getTickIntervalSeconds(config: TimeSignatureConfig, bpm: number): number {
  const quarterDuration = 60 / bpm;
  if (config.type === "simple") {
    return quarterDuration / 4; // sixteenth
  }
  return quarterDuration / 2; // compound: eighth-note subdivision
}

export function useTimeSignaturePlayer(config: TimeSignatureConfig, bpm: number = DEFAULT_BPM) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTick, setCurrentTick] = useState(0);
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const ticksPerBar = getTicksPerBar(config);
  const tickIntervalMs = getTickIntervalSeconds(config, bpm) * 1000;

  const triggerClick = useCallback((_tick: number, isAccent: boolean) => {
    try {
      if (isAccent) {
        fourthBeatSynth.triggerAttackRelease("C6", "8n", Tone.now());
      } else {
        weakBeatSynth.triggerAttackRelease("B4", "16n", Tone.now());
      }
    } catch (e) {
      console.warn("Time signature click failed", e);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const cfg = configRef.current;
    const interval = setInterval(() => {
      tickRef.current = (tickRef.current + 1) % ticksPerBar;
      const t = tickRef.current;
      setCurrentTick(t);

      const clickIndex = cfg.clickAtTicks.indexOf(t);
      if (clickIndex !== -1) {
        triggerClick(t, clickIndex === 0);
      }
    }, tickIntervalMs);

    intervalRef.current = interval;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, ticksPerBar, tickIntervalMs, triggerClick, config.clickAtTicks]);

  const start = useCallback(async () => {
    await Tone.context.resume();
    tickRef.current = 0;
    setCurrentTick(0);
    const clickIndex = config.clickAtTicks.indexOf(0);
    if (clickIndex !== -1) {
      triggerClick(0, clickIndex === 0);
    }
    setIsPlaying(true);
  }, [config.clickAtTicks, triggerClick]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTick(0);
    tickRef.current = 0;
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  return { isPlaying, currentTick, toggle, start, stop };
}
