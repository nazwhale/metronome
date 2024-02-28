import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { fourthBeatSynth, regularSynth } from "../synth";
import { circleOfFifths } from "../circleOfFifths";
import { calculateInterval } from "../utils";
import { useLocalStorage } from "usehooks-ts";
import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();


const BEATS_PER_BAR = 4;
const FIRST_CHANGE_BAR = 5;
const BARS_BETWEEN_CHANGES = 4;
const localStorageKeyBpm = "bpm";

const useMetronome = (updateNoteEveryFourBars: boolean = false) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useLocalStorage(localStorageKeyBpm, 120);
  const beatRef = useRef(0);
  const barCountRef = useRef(0);
  const currentNoteRef = useRef(circleOfFifths[0]);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [currentBar, setCurrentBar] = useState(1);

  useEffect(() => {
    // Debug: Log the BPM and the state of Tone.Transport
    console.log(`Initializing metronome with BPM: ${bpm}`);
    console.log(`Tone.Transport state: ${Tone.Transport.state}`);

    const scheduleId = Tone.Transport.scheduleRepeat((time) => {
      console.log("Scheduled repeat triggered."); // Debug statement
      updateBeat();
      updateBarAndNote(updateNoteEveryFourBars);
      triggerSynth(time);
    }, calculateInterval(bpm));

    return () => {
      Tone.Transport.clear(scheduleId);
      console.log("Transport cleared."); // Debug statement
    };
  }, [bpm, updateNoteEveryFourBars]);

  const updateBeat = () => {
    beatRef.current = (beatRef.current % BEATS_PER_BAR) + 1;
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
    return barCount % BEATS_PER_BAR === 0
      ? BEATS_PER_BAR
      : barCount % BEATS_PER_BAR;
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
    console.log("Triggering synth."); // Debug statement
    console.log(`AudioContext State before playing: ${Tone.context.state}`);
    console.log(`Synth volume: ${regularSynth.volume.value}`);

    if (isFirstBeat()) {
      console.log(`First beat: Playing ${currentNoteRef.current}6`); // Debug statement

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
      console.log(`Regular beat: Playing ${currentNoteRef.current}5`); // Debug statement
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

    // Enable NoSleep to prevent the screen from going to sleep
    await noSleep.enable();

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
