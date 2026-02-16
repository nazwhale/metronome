import Fretboard, { FretRangeDiagram } from "./Fretboard";
import {
  type CardId,
  getTriadPositions,
  getFretWindow,
  getPromptFretWindow,
  positionLabel,
} from "./data";

export type Result = "gotIt" | "miss";

interface FlashcardProps {
  card: CardId;
  flipped: boolean;
  /** 0–1, how much of the time limit has elapsed (for progress bar). */
  timeProgress: number;
  /** Seconds allowed before losing a life (for progress bar label). */
  secondsPerCard: number;
  onFlip: () => void;
  onResult: (result: Result) => void;
}

export default function Flashcard({
  card,
  flipped,
  timeProgress,
  secondsPerCard,
  onFlip,
  onResult,
}: FlashcardProps) {
  const positions = getTriadPositions(card.key, card.position);
  const displayWindow = getFretWindow(card.key, card.position);
  const promptFretWindow = getPromptFretWindow(card.key, card.position);

  return (
    <div className="card bg-base-200 shadow-xl" role="region" aria-label={flipped ? "Answer" : "Question"}>
      <div className="card-body items-center text-center">
        {!flipped ? (
          <>
            <dl className="text-left inline-block mt-0">
              <div className="flex gap-3">
                <dt className="text-base-content/60 text-sm w-24 shrink-0">Key</dt>
                <dd className="font-semibold text-base m-0">{card.key} major</dd>
              </div>
            </dl>
            <p className="text-sm text-base-content/70 mt-3">Play in this range:</p>
            <div className="mt-2">
              <FretRangeDiagram fretWindow={promptFretWindow} />
            </div>
            <dl className="text-left inline-block mt-3 space-y-1.5">
              <div className="flex gap-3">
                <dt className="text-base-content/60 text-sm w-24 shrink-0">String set</dt>
                <dd className="font-medium text-base m-0">G–B–e</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-base-content/60 text-sm w-24 shrink-0">Position</dt>
                <dd className="font-medium text-base m-0">{positionLabel(card.position)}</dd>
              </div>
            </dl>
            <div className="w-full mt-4" role="progressbar" aria-valuenow={Math.round(timeProgress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Time before losing a life">
              <div className="h-2 w-full rounded-full bg-base-300 overflow-hidden">
                <div
                  className="h-full bg-warning transition-[width] duration-75 ease-linear"
                  style={{ width: `${timeProgress * 100}%` }}
                />
              </div>
              <p className="text-xs text-base-content/50 mt-1">{secondsPerCard}s limit</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-4"
              onClick={onFlip}
              aria-label="Reveal answer (or press Space)"
            >
              Show answer (Space)
            </button>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-base-content/80">
              {card.key} major · {positionLabel(card.position)}
            </p>
            <div className="mt-4">
              <Fretboard
                positions={positions}
                positionWindow={displayWindow}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => onResult("miss")}
                aria-label="Miss (Left arrow)"
              >
                ← Miss (Left)
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => onResult("gotIt")}
                aria-label="Got it (Right arrow)"
              >
                Got it (Right) →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
