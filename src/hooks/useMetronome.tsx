import { useState, useEffect, useRef, useMemo } from "react";
import * as Tone from "tone";
import { fourthBeatSynth, regularSynth } from "../synth";
import { circleOfFifths } from "../circleOfFifths";
import { calculateInterval } from "../utils";
import { useLocalStorage } from "usehooks-ts";
import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();


const FIRST_CHANGE_BAR = 5;
const BARS_BETWEEN_CHANGES = 4;
const localStorageKeyBpm = "bpm";

type UseMetronomeOptions = {
  updateNoteEveryFourBars?: boolean;
  beatsPerBar?: number;
  muteAlternatingBars?: boolean;
  playBars?: number;
  muteBars?: number;
  accents?: boolean[];
  initialBpm?: number;
};

const useMetronome = (options: UseMetronomeOptions = {}) => {
  const {
    updateNoteEveryFourBars = false,
    beatsPerBar = 4,
    muteAlternatingBars = false,
    playBars = 1,
    muteBars = 1,
    accents,
    initialBpm,
  } = options;

  // Default accents: beat 1 is accented, rest are not
  // Memoize to avoid recreating array on every render
  const accentPattern = useMemo(
    () => accents ?? Array.from({ length: beatsPerBar }, (_, i) => i === 0),
    [accents, beatsPerBar]
  );

  // Use ref so the scheduled callback always has the latest accent pattern
  const accentPatternRef = useRef(accentPattern);
  useEffect(() => {
    accentPatternRef.current = accentPattern;
  }, [accentPattern]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useLocalStorage(localStorageKeyBpm, initialBpm ?? 120);
  const beatRef = useRef(0);
  const barCountRef = useRef(0);
  const currentNoteRef = useRef(circleOfFifths[0]);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);
  const [isBarMuted, setIsBarMuted] = useState(false);

  useEffect(() => {
    // Debug: Log the BPM and the state of Tone.Transport
    console.log(`Initializing metronome with BPM: ${bpm}`);
    console.log(`Tone.Transport state: ${Tone.Transport.state}`);

    const scheduleId = Tone.Transport.scheduleRepeat((time) => {
      updateBeat();
      updateBarAndNote(updateNoteEveryFourBars);
      triggerSynth(time);
    }, calculateInterval(bpm));

    return () => {
      Tone.Transport.clear(scheduleId);
      console.log("Transport cleared."); // Debug statement
    };
  }, [bpm, updateNoteEveryFourBars, beatsPerBar, muteAlternatingBars, playBars, muteBars]);

  const updateBeat = () => {
    beatRef.current = (beatRef.current % beatsPerBar) + 1;
    setCurrentBeat(beatRef.current);
  };

  const updateBarAndNote = (updateNoteEveryFourBars: boolean) => {
    if (isFirstBeat()) {
      barCountRef.current += 1;
      updateCurrentBar();
      maybeUpdateCurrentNote(updateNoteEveryFourBars);
    }
  };

  const isFirstBeat = () => beatRef.current === 1;

  const updateCurrentBar = () => {
    setCurrentBar(getBarDisplayValue(barCountRef.current));
  };

  const getBarDisplayValue = (barCount: number) => {
    return barCount % beatsPerBar === 0
      ? beatsPerBar
      : barCount % beatsPerBar;
  };

  const maybeUpdateCurrentNote = (updateNoteEveryFourBars: boolean) => {
    if (updateNoteEveryFourBars && shouldChangeNote()) {
      currentNoteRef.current = getNextNote(currentNoteRef.current);
    }
  };

  const shouldChangeNote = () => {
    return (
      barCountRef.current >= FIRST_CHANGE_BAR &&
      (barCountRef.current - FIRST_CHANGE_BAR) % BARS_BETWEEN_CHANGES === 0
    );
  };

  const triggerSynth = (time: number) => {
    // Timing diagnostic: if delta is negative, notes are scheduled in the past and will be silent
    const currentTime = Tone.context.currentTime;
    const delta = time - currentTime;
    if (delta < 0) {
      console.warn(`⚠️ TIMING ISSUE: Schedule time (${time.toFixed(3)}) is ${Math.abs(delta).toFixed(3)}s in the PAST (currentTime: ${currentTime.toFixed(3)}). Audio will be silent!`);
    }

    // Check if this bar should be muted based on play/mute bar cycle
    const cycleLength = playBars + muteBars;
    const positionInCycle = ((barCountRef.current - 1) % cycleLength) + 1;
    const shouldMuteThisBar = muteAlternatingBars && positionInCycle > playBars;
    setIsBarMuted(shouldMuteThisBar);

    if (shouldMuteThisBar) {
      return;
    }

    // Check if current beat is accented (beatRef.current is 1-indexed)
    const isAccentedBeat = accentPatternRef.current[beatRef.current - 1] ?? false;

    if (isAccentedBeat) {
      try {
        fourthBeatSynth.triggerAttackRelease(
          currentNoteRef.current + "6",
          "8n",
          time,
        );
      } catch (error) {
        console.error("Error triggering fourthBeatSynth:", error);
      }
    } else {
      try {
        regularSynth.triggerAttackRelease(
          currentNoteRef.current + "5",
          "8n",
          time,
        );
      } catch (error) {
        console.error("Error triggering regularSynth:", error);
      }
    }
  };

  // Toggles the metronome's state based on the current isPlaying state
  const toggleMetronome = () => {
    // If the metronome is currently playing, stop it
    if (isPlaying) {
      stopMetronome();
    } else {
      // If the metronome is not playing, start it
      // Wrapped in a try-catch to handle any errors that might occur
      // when starting the metronome, especially relevant for handling
      // mobile device restrictions on audio playback
      try {
        startMetronome();
      } catch (error) {
        console.error("Error starting metronome:", error);
      }
    }
  };

  // Starts the metronome
  const startMetronome = async () => {
    console.log("Attempting to start metronome...");

    // Ensures the audio context is resumed before starting the metronome
    // This is crucial for mobile devices due to stricter autoplay policies
    await Tone.context.resume();
    console.log("Audio context resumed.");

    // Starts Tone.Transport to begin metronome ticking
    Tone.Transport.start();
    console.log("Metronome started.");

    // Enable NoSleep to prevent the screen from going to sleep.
    // IMPORTANT: Must be wrapped in try-catch because NoSleep uses the Screen Wake Lock API,
    // which is blocked by browser permissions policy in third-party iframes (e.g., when embedded).
    // Without this try-catch, the error would prevent setIsPlaying(true) from being called,
    // breaking the start/stop functionality in embedded contexts.
    try {
      await noSleep.enable();
    } catch {
      // Screen Wake Lock not available (e.g., in cross-origin iframe) - continue without it
    }

    // Directly sets isPlaying to true, indicating the metronome is now playing
    setIsPlaying(true);
  };

  // Stops the metronome
  const stopMetronome = () => {
    console.log("Stopping metronome...");

    // Stops Tone.Transport, effectively stopping the metronome
    Tone.Transport.stop();
    console.log("Metronome stopped.");

    // Disable NoSleep to allow the screen to go to sleep again
    noSleep.disable();

    // Directly sets isPlaying to false, indicating the metronome has stopped
    setIsPlaying(false);
  };

  return {
    isPlaying,
    bpm,
    currentBeat,
    currentBar,
    beatsPerBar,
    isBarMuted,
    currentNote: currentNoteRef.current,
    nextNote: getNextNote(currentNoteRef.current),
    toggleMetronome,
    setBpm,
  };
};

const getNextNote = (currentNote: string): string => {
  const currentNoteIndex = circleOfFifths.indexOf(currentNote);
  const nextNoteIndex = (currentNoteIndex + 1) % circleOfFifths.length;
  return circleOfFifths[nextNoteIndex];
};

export { useMetronome };
