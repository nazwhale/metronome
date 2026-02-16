import React, { useState } from "react";
import { useSpeedTrainerMetronome } from "../hooks/useSpeedTrainerMetronome";
import { useLocalStorage } from "usehooks-ts";
import PlayButton from "./PlayButton";
import BeatDots from "./BeatDots";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";
import SEO from "../components/SEO";
import WebApplicationSchema from "../components/WebApplicationSchema";
import ToolPracticeGuide from "../components/ToolPracticeGuide";
import { BASE_URL } from "../i18n/translations";

// Default: beat 1 accented, rest unaccented
const createDefaultAccents = (count: number): boolean[] =>
    Array.from({ length: count }, (_, i) => i === 0);

export type SpeedTrainerSettings = {
    startBpm?: number;
    targetBpm?: number;
    bpmIncrement?: number;
    barsBeforeIncrement?: number;
};

export type SpeedTrainerProps = {
    initialSettings?: SpeedTrainerSettings;
};

const SpeedTrainer: React.FC<SpeedTrainerProps> = ({ initialSettings }) => {
    const isEmbed = useIsEmbed();
    const [startBpm, setStartBpm] = useState(initialSettings?.startBpm ?? 60);
    const [targetBpm, setTargetBpm] = useState(initialSettings?.targetBpm ?? 90);
    const [bpmIncrement, setBpmIncrement] = useState(initialSettings?.bpmIncrement ?? 5);
    const [barsBeforeIncrement, setBarsBeforeIncrement] = useState(initialSettings?.barsBeforeIncrement ?? 4);
    const [accents, setAccents] = useLocalStorage<boolean[]>(
        "speedTrainerAccents",
        createDefaultAccents(4)
    );

    const handleAccentToggle = (beatIndex: number) => {
        const newAccents = [...accents];
        newAccents[beatIndex] = !newAccents[beatIndex];
        setAccents(newAccents);
    };

    const { isPlaying, currentBpm, currentBeat, currentBar, toggleMetronome } =
        useSpeedTrainerMetronome({
            startBpm,
            targetBpm,
            bpmIncrement,
            barsBeforeIncrement,
            accents,
        });

    return (
        <>
            {!isEmbed && (
                <>
                    <SEO
                        title="Speed Trainer Metronome - Metronome That Speeds Up | tempotick"
                        description="Free speed trainer metronome. An increasing metronome that speeds up from start to target BPM so you can build speed gradually. Set increment and bars—no ads."
                        lang="en"
                        canonicalPath="/speed-trainer-metronome"
                    />
                    <WebApplicationSchema
                        name="Speed Trainer Metronome"
                        url={`${BASE_URL}/speed-trainer-metronome`}
                        description="Free metronome trainer that speeds up: set start and target BPM, and the metronome tick increases automatically. Build speed with an accelerating metronome."
                        applicationCategory="MusicApplication"
                    />
                </>
            )}

        <div className="flex flex-col items-center gap-8">
            {!isEmbed && (
                <h1 className="text-2xl font-bold text-center">Speed trainer metronome</h1>
            )}
            {/* Beat Dots - always at top */}
            <BeatDots
                currentBeat={currentBeat}
                accents={accents}
                onAccentToggle={handleAccentToggle}
            />

            {/* Settings - only show when not playing */}
            {!isPlaying && (
                <div className="flex flex-col items-center gap-6">
                    {/* Start BPM */}
                    <div className="flex flex-col items-center">
                        <label className="label">
                            <span className="label-text">Start BPM</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setStartBpm(Math.max(40, startBpm - 5))}
                            >
                                -5
                            </button>
                            <input
                                type="number"
                                min={40}
                                max={200}
                                value={startBpm}
                                onChange={(e) => setStartBpm(Number(e.target.value))}
                                className="input input-bordered w-24 text-center"
                            />
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setStartBpm(Math.min(200, startBpm + 5))}
                            >
                                +5
                            </button>
                        </div>
                        <input
                            type="range"
                            min={40}
                            max={200}
                            value={startBpm}
                            className="range range-sm mt-2 w-64"
                            onChange={(e) => setStartBpm(Number(e.target.value))}
                        />
                    </div>

                    {/* Target BPM */}
                    <div className="flex flex-col items-center">
                        <label className="label">
                            <span className="label-text">Target BPM</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setTargetBpm(Math.max(startBpm, targetBpm - 5))}
                            >
                                -5
                            </button>
                            <input
                                type="number"
                                min={startBpm}
                                max={250}
                                value={targetBpm}
                                onChange={(e) => setTargetBpm(Number(e.target.value))}
                                className="input input-bordered w-24 text-center"
                            />
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setTargetBpm(Math.min(250, targetBpm + 5))}
                            >
                                +5
                            </button>
                        </div>
                        <input
                            type="range"
                            min={startBpm}
                            max={250}
                            value={targetBpm}
                            className="range range-sm mt-2 w-64"
                            onChange={(e) => setTargetBpm(Number(e.target.value))}
                        />
                    </div>

                    {/* BPM Increment */}
                    <div className="flex flex-col items-center">
                        <label className="label">
                            <span className="label-text">BPM Increment</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setBpmIncrement(Math.max(1, bpmIncrement - 1))}
                            >
                                -1
                            </button>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={bpmIncrement}
                                onChange={(e) => setBpmIncrement(Number(e.target.value))}
                                className="input input-bordered w-24 text-center"
                            />
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setBpmIncrement(Math.min(20, bpmIncrement + 1))}
                            >
                                +1
                            </button>
                        </div>
                    </div>

                    {/* Bars Before Increment */}
                    <div className="flex flex-col items-center">
                        <label className="label">
                            <span className="label-text">Bars Before Increment</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setBarsBeforeIncrement(Math.max(1, barsBeforeIncrement - 1))}
                            >
                                -1
                            </button>
                            <input
                                type="number"
                                min={1}
                                max={16}
                                value={barsBeforeIncrement}
                                onChange={(e) => setBarsBeforeIncrement(Number(e.target.value))}
                                className="input input-bordered w-24 text-center"
                            />
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setBarsBeforeIncrement(Math.min(16, barsBeforeIncrement + 1))}
                            >
                                +1
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Stats - show when playing */}
            {isPlaying && (
                <div className="flex flex-col items-center gap-4">
                    {/* Current BPM Display */}
                    <div className="flex flex-col items-center">
                        <div className="stat">
                            <div className="stat-title">Current BPM</div>
                            <div className="stat-value text-primary">{currentBpm}</div>
                            <div className="stat-desc">
                                Target: {targetBpm} BPM
                            </div>
                        </div>
                    </div>

                    {/* Bar Counter */}
                    <div className="bg-neutral-content stats shadow max-w-xs mx-auto">
                        <div className="stat">
                            <div className="stat-title">bar</div>
                            <div className="stat-value">
                                <span className="countdown">{currentBar}</span>
                            </div>
                            <div className="stat-desc">out of {barsBeforeIncrement}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Play Button */}
            <PlayButton isPlaying={isPlaying} onToggle={toggleMetronome} />

            {/* Embed Button - hidden in embed mode */}
            {!isEmbed && (
                <EmbedButton
                    embedPath="/embed/speed-trainer"
                    canonicalPath="/speed-trainer-metronome"
                    queryParams={{
                        start: startBpm,
                        target: targetBpm,
                        inc: bpmIncrement,
                        bars: barsBeforeIncrement,
                    }}
                    height={520}
                    toolName="Speed Trainer"
                />
            )}
        </div>

            {!isEmbed && (
                <div className="max-w-lg mx-auto px-4 mt-8 w-full">
                    <div className="divider" />
                    <ToolPracticeGuide
                        title="Practice with the speed trainer metronome"
                        features={[
                            "Metronome that speeds up — start BPM increases to target BPM automatically",
                            "Set start and target BPM, and how much to increase each step (BPM increment)",
                            "Bars before increment — how many bars at each tempo before the tick speeds up",
                            "Beat accents — accent any beat in the bar",
                            "Free — no ads, no download",
                        ]}
                        howToUseSteps={[
                            "Set Start BPM to a tempo you can play cleanly (e.g. 60–80). Set Target BPM to your goal (e.g. 100–120).",
                            "Choose BPM Increment (e.g. 5). The metronome will increase by this amount after each step.",
                            "Set Bars Before Increment (e.g. 4). You’ll hear that many bars at each tempo before it speeds up.",
                            "Press play. Practise your exercise or piece; when the metronome speeds up, stay with the tick.",
                            "If you fall behind, stop and lower start BPM or use a smaller increment. Repeat until you reach target cleanly.",
                        ]}
                        exampleRoutine={
                            <>
                                <p className="m-0">
                                    <strong>Warm-up (2–3 min):</strong> Start 60, target 80, +5 BPM every 4 bars. Play a simple scale or pattern; get used to the increasing metronome.
                                </p>
                                <p className="m-0">
                                    <strong>Main (10–15 min):</strong> Start at your “comfortable” tempo, target at your “goal” tempo. Use 4–8 bars per step. Focus on staying with the tick as it accelerates.
                                </p>
                                <p className="m-0">
                                    <strong>Cool-down:</strong> Run the same exercise with a smaller increment (e.g. +2) so the speed increase is more gradual. Builds control at the edge of your speed.
                                </p>
                            </>
                        }
                        settingsExplained={
                            <>
                                <p className="m-0">
                                    <strong>Start BPM & Target BPM:</strong> The metronome begins at start and increases until it reaches target. Pick a start you can play accurately and a target you’re working toward.
                                </p>
                                <p className="m-0 mt-1.5">
                                    <strong>BPM Increment:</strong> How much the tempo goes up at each step (e.g. +5 BPM). Smaller steps make the accelerating metronome easier to follow; larger steps push you faster.
                                </p>
                                <p className="m-0 mt-1.5">
                                    <strong>Bars before increment:</strong> How many bars (at the current tempo) before the metronome speeds up. More bars give you time to settle at each tempo; fewer bars ramp up quickly.
                                </p>
                            </>
                        }
                        otherTools={[
                            { path: "/online-metronome", name: "Online metronome" },
                            { path: "/guitar-triad-trainer", name: "Guitar triad trainer" },
                        ]}
                    />
                </div>
            )}
        </>
    );
};

export default SpeedTrainer;

