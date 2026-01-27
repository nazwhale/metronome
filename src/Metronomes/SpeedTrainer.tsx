import React, { useState, useEffect } from "react";
import { useSpeedTrainerMetronome } from "../hooks/useSpeedTrainerMetronome";
import PlayButton from "./PlayButton";

const SpeedTrainer: React.FC = () => {
    useEffect(() => {
        document.title = "Free Speed Trainer Metronome - Build Speed & Accuracy | No Ads";
    }, []);
    const [startBpm, setStartBpm] = useState(60);
    const [targetBpm, setTargetBpm] = useState(90);
    const [bpmIncrement, setBpmIncrement] = useState(5);
    const [barsBeforeIncrement, setBarsBeforeIncrement] = useState(4);

    const { isPlaying, currentBpm, currentBeat, currentBar, toggleMetronome } =
        useSpeedTrainerMetronome({
            startBpm,
            targetBpm,
            bpmIncrement,
            barsBeforeIncrement,
        });

    return (
        <div className="space-y-8">
            {/* Settings - only show when not playing */}
            {!isPlaying && (
                <div className="space-y-6">
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
                <div className="space-y-4">
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

                    {/* Beat and Bar Stats */}
                    <div className="bg-neutral-content stats stats-vertical sm:stats-horizontal shadow flex flex-grow max-w-md mx-auto">
                        <div className="stat">
                            <div className="stat-title">beat</div>
                            <div className="stat-value">
                                <span className="countdown">{currentBeat}</span>
                            </div>
                            <div className="stat-desc">out of 4</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">bar</div>
                            <div className="stat-value">
                                <span className="countdown">{currentBar}</span>
                            </div>
                            <div className="stat-desc">out of 4</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Play Button */}
            <PlayButton isPlaying={isPlaying} onToggle={toggleMetronome} />
        </div>
    );
};

export default SpeedTrainer;

