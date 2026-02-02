import { useState, useEffect, useRef, useMemo } from "react";
import * as Tone from "tone";
import { fourthBeatSynth, regularSynth } from "../synth";
import { circleOfFifths } from "../circleOfFifths";
import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();

const BEATS_PER_BAR = 4;

type SpeedTrainerConfig = {
    startBpm: number;
    targetBpm: number;
    bpmIncrement: number;
    barsBeforeIncrement: number;
    accents?: boolean[];
};

const useSpeedTrainerMetronome = (config: SpeedTrainerConfig) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBpm, setCurrentBpm] = useState(config.startBpm);
    const currentBpmRef = useRef(config.startBpm);
    const beatRef = useRef(0);
    const barCountRef = useRef(0);
    const currentNoteRef = useRef(circleOfFifths[0]);
    const [currentBeat, setCurrentBeat] = useState(1);
    const [currentBar, setCurrentBar] = useState(1);
    const scheduleIdRef = useRef<number | null>(null);

    // Default accents: beat 1 is accented, rest are not
    const accentPattern = useMemo(
        () => config.accents ?? Array.from({ length: BEATS_PER_BAR }, (_, i) => i === 0),
        [config.accents]
    );

    // Use ref so the scheduled callback always has the latest accent pattern
    const accentPatternRef = useRef(accentPattern);
    useEffect(() => {
        accentPatternRef.current = accentPattern;
    }, [accentPattern]);

    // Setup metronome schedule when playing starts
    useEffect(() => {
        if (!isPlaying) {
            // Clear any existing schedule when stopped
            if (scheduleIdRef.current !== null) {
                Tone.Transport.clear(scheduleIdRef.current);
                scheduleIdRef.current = null;
            }
            return;
        }

        // Only schedule once when starting - don't reschedule on BPM changes
        if (scheduleIdRef.current !== null) return;

        // Set initial BPM
        Tone.Transport.bpm.value = currentBpmRef.current;

        const scheduleId = Tone.Transport.scheduleRepeat((time) => {
            updateBeat();
            updateBarAndBpm();
            triggerSynth(time);
        }, "4n"); // Use quarter note instead of calculated interval

        scheduleIdRef.current = scheduleId;

        return () => {
            if (scheduleIdRef.current !== null) {
                Tone.Transport.clear(scheduleIdRef.current);
                scheduleIdRef.current = null;
            }
        };
    }, [isPlaying]);

    // Update Transport BPM when currentBpm changes (for display and actual tempo)
    useEffect(() => {
        if (isPlaying) {
            Tone.Transport.bpm.value = currentBpm;
            currentBpmRef.current = currentBpm;
        }
    }, [currentBpm, isPlaying]);

    const updateBeat = () => {
        beatRef.current = (beatRef.current % BEATS_PER_BAR) + 1;
        setCurrentBeat(beatRef.current);
    };

    const updateBarAndBpm = () => {
        if (isFirstBeat()) {
            barCountRef.current += 1;
            updateCurrentBar();
            maybeIncreaseBpm();
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

    const maybeIncreaseBpm = () => {
        // Check if we should increase BPM
        // Increase after completing the specified number of bars
        // e.g., if barsBeforeIncrement is 4, increase at bar 5, 9, 13, etc.
        if (
            currentBpmRef.current < config.targetBpm &&
            barCountRef.current > config.barsBeforeIncrement &&
            (barCountRef.current - 1) % config.barsBeforeIncrement === 0
        ) {
            const newBpm = Math.min(
                currentBpmRef.current + config.bpmIncrement,
                config.targetBpm
            );
            console.log(`Increasing BPM from ${currentBpmRef.current} to ${newBpm} at bar ${barCountRef.current}`);
            // Update BPM smoothly using Tone.Transport.bpm
            setCurrentBpm(newBpm);
        }
    };

    const triggerSynth = (time: number) => {
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

    const toggleMetronome = () => {
        if (isPlaying) {
            stopMetronome();
        } else {
            try {
                startMetronome();
            } catch (error) {
                console.error("Error starting metronome:", error);
            }
        }
    };

    const startMetronome = async () => {
        console.log("Attempting to start speed trainer metronome...");

        // Reset state when starting
        beatRef.current = 0;
        barCountRef.current = 0;
        currentBpmRef.current = config.startBpm;
        setCurrentBeat(1);
        setCurrentBar(1);
        setCurrentBpm(config.startBpm);

        await Tone.context.resume();
        console.log("Audio context resumed.");

        Tone.Transport.start();
        console.log("Speed trainer metronome started.");

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

        setIsPlaying(true);
    };

    const stopMetronome = () => {
        console.log("Stopping speed trainer metronome...");

        Tone.Transport.stop();
        console.log("Speed trainer metronome stopped.");

        noSleep.disable();

        setIsPlaying(false);
    };

    return {
        isPlaying,
        currentBpm,
        currentBeat,
        currentBar,
        toggleMetronome,
    };
};

export { useSpeedTrainerMetronome };

