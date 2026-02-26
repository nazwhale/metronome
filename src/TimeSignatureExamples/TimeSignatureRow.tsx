import React from "react";
import PlayButton from "../Metronomes/PlayButton";
import { TimeSignatureExplainer } from "./TimeSignatureExplainer";
import type { TimeSignatureConfig } from "./data";
import { getSubdivisionLabels } from "./data";
import { useTimeSignaturePlayer } from "./useTimeSignaturePlayer";

type TimeSignatureRowProps = {
  config: TimeSignatureConfig;
  bpm?: number;
};

export const TimeSignatureRow: React.FC<TimeSignatureRowProps> = ({
  config,
  bpm = 72,
}) => {
  const { isPlaying, currentTick, toggle } = useTimeSignaturePlayer(config, bpm);
  const labels = getSubdivisionLabels(config);
  const clickAtTicks = new Set(config.clickAtTicks);
  const isFirstClick = (i: number) => config.clickAtTicks[0] === i;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-base-200/60 border border-base-300/50">
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-lg font-bold tabular-nums">{config.label}</span>
          <span className="text-sm text-base-content/70">{config.category}</span>
          {config.explainer ? <TimeSignatureExplainer explainer={config.explainer} /> : null}
          <span className="text-sm text-base-content/50 font-normal tabular-nums" aria-label={`${config.beatUnitLabel}, ${config.beatUnitSymbol} = ${bpm}`}>
            <span className="font-serif" style={{ fontFamily: "serif" }}>{config.beatUnitSymbol}</span>
            <span className="ml-0.5">= {bpm}</span>
          </span>
        </div>
        {config.comment && (
          <p className="text-sm text-base-content/60 italic mt-0.5">{config.comment}</p>
        )}
        <p className="text-xs text-base-content/50 mt-0.5">{config.beatUnitLabel}</p>
        <p className="text-xs text-base-content/50 mt-1">
          <span className="font-medium text-base-content/60">Examples:</span>{" "}
          {config.songExamples.join(" · ")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PlayButton isPlaying={isPlaying} onToggle={toggle} />
        <div
          className="flex flex-wrap gap-1 items-center"
          role="marquee"
          aria-live="polite"
          aria-label={`Counting ${config.label}, current subdivision ${labels[currentTick] ?? ""}`}
        >
          {labels.map((char, i) => {
            const isActive = currentTick === i;
            const isBeatStart = clickAtTicks.has(i);
            const isAccent = isFirstClick(i);
            return (
              <span
                key={`${i}-${char}`}
                className={`
                  inline-flex items-center justify-center min-w-[1.75rem] h-8 px-1 rounded
                  text-sm font-medium transition-all duration-75
                  ${isActive
                    ? isBeatStart
                      ? isAccent
                        ? "bg-primary text-primary-content scale-110"
                        : "bg-primary/70 text-primary-content"
                      : "bg-base-content/20 text-base-content"
                    : isBeatStart
                      ? "text-base-content/80 font-semibold"
                      : "text-base-content/50"
                  }
                `}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
