import Fretboard, { FretRangeDiagram } from "./Fretboard";
import {
  type CardId,
  type Quality,
  type Stage,
  type StringSetStage,
  getTriadPositionsForStage,
  getFretWindowForStage,
  getPromptFretWindowForStage,
  STRING_SET_LABEL_BY_STRING_SET,
  STRING_LABELS_BY_STAGE,
  TAB_STRING_LABELS_BY_STAGE,
  positionLabel,
} from "./data";

/** Resolve effective string set for this stage (1, 2, or 4). Stage 6 uses cardStage. */
function effectiveStringSetForStage(stage: Stage, cardStage: StringSetStage | undefined): StringSetStage {
  if (stage === 6) return cardStage ?? 1;
  if (stage === 1 || stage === 2 || stage === 3) return 1;
  if (stage === 4 || stage === 5) return 2;
  if (stage === 7) return 4;
  return 1;
}

/** Resolve quality for this stage. Stage 3 and 6 use cardQuality. */
function effectiveQualityForStage(stage: Stage, cardQuality: Quality | undefined): Quality {
  if (stage === 2 || stage === 5) return "minor";
  if ((stage === 3 || stage === 6) && cardQuality != null) return cardQuality;
  return "major";
}

export type Result = "gotIt" | "miss";

interface FlashcardProps {
  card: CardId;
  stage: Stage;
  /** When stage is 6 (mixed 2 sets), which string set this card uses. */
  cardStage?: StringSetStage;
  /** When stage is 3 or 6 (mixed major/minor), which quality this card uses. */
  cardQuality?: Quality;
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
  stage,
  cardStage,
  cardQuality,
  flipped,
  timeProgress,
  secondsPerCard,
  onFlip,
  onResult,
}: FlashcardProps) {
  const effectiveStage = effectiveStringSetForStage(stage, cardStage);
  const quality = effectiveQualityForStage(stage, cardQuality);
  const positions = getTriadPositionsForStage(effectiveStage, card.key, card.position, quality);
  const displayWindow = getFretWindowForStage(effectiveStage, card.key, card.position, quality);
  const promptFretWindow = getPromptFretWindowForStage(effectiveStage, card.key, card.position, quality);
  const stringLabels = STRING_LABELS_BY_STAGE[effectiveStage];
  const tabStringLabels = TAB_STRING_LABELS_BY_STAGE[effectiveStage];
  const qualityLabel = quality === "minor" ? "minor" : "major";

  return (
    <div className="card bg-base-200 shadow-xl" role="region" aria-label={flipped ? "Answer" : "Question"}>
      <div className="card-body items-center text-center">
        {!flipped ? (
          <>
            <dl className="text-left inline-block mt-0">
              <div className="flex gap-3">
                <dt className="text-base-content/60 text-sm w-24 shrink-0">Key</dt>
                <dd className="font-semibold text-base m-0">{card.key} {qualityLabel}</dd>
              </div>
            </dl>
            <p className="text-sm text-base-content/70 mt-3">Play in this range:</p>
            <div className="mt-2">
              <FretRangeDiagram fretWindow={promptFretWindow} stringLabels={tabStringLabels} />
            </div>
            <dl className="text-left inline-block mt-3 space-y-1.5">
              <div className="flex gap-3">
                <dt className="text-base-content/60 text-sm w-24 shrink-0">String set</dt>
                <dd className="font-medium text-base m-0">{STRING_SET_LABEL_BY_STRING_SET[effectiveStage]}</dd>
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
              {card.key} {qualityLabel} · {positionLabel(card.position)}
            </p>
            <div className="mt-4">
              <Fretboard
                positions={positions}
                positionWindow={displayWindow}
                stringLabels={stringLabels}
                quality={quality}
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
