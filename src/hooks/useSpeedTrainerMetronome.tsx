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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:toggleMetronome',message:'ST toggleMetronome called',data:{isPlaying,transportState:Tone.Transport.state,contextState:Tone.context.state},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H3,H4'})}).catch(()=>{});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:entry',message:'ST startMetronome called',data:{contextStateBefore:Tone.context.state,transportStateBefore:Tone.Transport.state},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H4'})}).catch(()=>{});
        // #endregion
        console.log("Attempting to start speed trainer metronome...");

        // Reset state when starting
        beatRef.current = 0;
        barCountRef.current = 0;
        currentBpmRef.current = config.startBpm;
        setCurrentBeat(1);
        setCurrentBar(1);
        setCurrentBpm(config.startBpm);

        try {
            await Tone.context.resume();
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:afterResume',message:'ST context.resume completed',data:{contextStateAfter:Tone.context.state},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
            // #endregion
        } catch (err) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:resumeError',message:'ST context.resume failed',data:{error:String(err)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
            // #endregion
        }
        console.log("Audio context resumed.");

        Tone.Transport.start();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:afterTransportStart',message:'ST Transport.start called',data:{transportStateAfter:Tone.Transport.state},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
        // #endregion
        console.log("Speed trainer metronome started.");

        try {
            await noSleep.enable();
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:noSleepEnabled',message:'ST noSleep.enable completed',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
        } catch (err) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:noSleepError',message:'ST noSleep.enable failed',data:{error:String(err)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
        }

        setIsPlaying(true);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/1e29dd22-9108-4958-aab4-ef776c58af0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpeedTrainerMetronome.tsx:startMetronome:exit',message:'ST setIsPlaying(true) called',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
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

