import React from "react";

type BeatDotsProps = {
  currentBeat: number;
  beatsPerBar?: number;
  accents?: boolean[];
  onAccentToggle?: (beatIndex: number) => void;
};

const BeatDots: React.FC<BeatDotsProps> = ({
  currentBeat,
  beatsPerBar = 4,
  accents,
  onAccentToggle,
}) => {
  // Default: beat 1 is always accented, others are not
  const defaultAccents = Array.from({ length: beatsPerBar }, (_, i) => i === 0);
  const accentPattern = accents ?? defaultAccents;

  return (
    <div className="flex justify-center gap-4">
      {Array.from({ length: beatsPerBar }, (_, i) => {
        const beat = i + 1;
        const isActive = currentBeat === beat;
        const isAccented = accentPattern[i] ?? (i === 0);
        const isBeatOne = beat === 1;

        return (
          <div key={beat} className="w-10 h-10 flex items-center justify-center">
            <button
              type="button"
              onClick={() => onAccentToggle?.(i)}
              className={`
                relative rounded-full transition-all duration-75
                ${onAccentToggle ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                ${isActive
                  ? isBeatOne
                    ? "w-10 h-10"
                    : "w-9 h-9"
                  : "w-8 h-8"
                }
                ${isAccented
                  ? isActive
                    ? "bg-primary shadow-lg shadow-primary/60"
                    : "bg-primary"
                  : isActive
                    ? "bg-base-content/25"
                    : "bg-transparent border-2 border-base-content/40"
                }
              `}
              aria-label={`Beat ${beat}${isAccented ? " (accented)" : ""} - tap to ${isAccented ? "unaccent" : "accent"}`}
            >
              {/* Beat number label */}
              <span
                className={`
                  absolute inset-0 flex items-center justify-center 
                  text-xs font-bold transition-all duration-75
                  ${isActive
                    ? isAccented
                      ? "text-primary-content"
                      : "text-base-content"
                    : isAccented
                      ? "text-primary-content/70"
                      : "text-base-content/50"
                  }
                `}
              >
                {beat}
              </span>
              
              {/* Pulse ring for beat 1 when active */}
              {isBeatOne && isActive && (
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BeatDots;
