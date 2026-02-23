import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import { cardId, type CardId, type Stage } from "./data";
import type { Result } from "./Flashcard";

export interface CardStat {
  correct: number;
  total: number;
  flipTimes: number[];
}

export interface BestRun {
  livesLost: number;
  averageTimeMs: number;
}

const STORAGE_KEY_LEVEL = "guitarTriadUnlockedLevel";
const STORAGE_KEY_LEVEL_BY_STAGE = "guitarTriadUnlockedLevelByStage";
const STORAGE_KEY_STATS = "guitarTriadCardStats";
const STORAGE_KEY_BEST_LIVES = "guitarTriadBestLivesLostByLevel";
const STORAGE_KEY_BEST_RUN = "guitarTriadBestRunByLevel";
const STORAGE_KEY_BEST_RUN_BY_STAGE = "guitarTriadBestRunByLevelByStage";
const LIVES_PER_LEVEL = 3;

function isRunBetter(current: BestRun | undefined, livesLost: number, averageTimeMs: number): boolean {
  if (!current) return true;
  if (livesLost < current.livesLost) return true;
  if (livesLost > current.livesLost) return false;
  return averageTimeMs < current.averageTimeMs;
}

/** Normalize stored level: legacy is a single number (stage 1); byStage stores per-stage when set. */
function normalizeUnlockedByStage(
  legacy: number,
  byStage: Record<string, number> | undefined
): Record<Stage, number> {
  return {
    1: (byStage && typeof byStage["1"] === "number" ? byStage["1"] : legacy),
    2: (byStage && typeof byStage["2"] === "number" ? byStage["2"] : 1),
  };
}

export function useTriadStats() {
  const [legacyUnlockedLevel, setLegacyUnlockedLevel] = useLocalStorage(STORAGE_KEY_LEVEL, 1);
  const [unlockedByStage, setUnlockedByStage] = useLocalStorage<Record<string, number>>(
    STORAGE_KEY_LEVEL_BY_STAGE,
    {}
  );
  const [cardStats, setCardStats] = useLocalStorage<Record<string, CardStat>>(
    STORAGE_KEY_STATS,
    {}
  );
  const [bestLivesLostByLevel] = useLocalStorage<Record<number, number>>(
    STORAGE_KEY_BEST_LIVES,
    {}
  );
  const [bestRunByLevel, setBestRunByLevel] = useLocalStorage<Record<number, BestRun>>(
    STORAGE_KEY_BEST_RUN,
    {}
  );
  const [bestRunByLevelByStage, setBestRunByLevelByStage] = useLocalStorage<
    Record<string, Record<number, BestRun>>
  >(STORAGE_KEY_BEST_RUN_BY_STAGE, {});

  const unlockedLevelByStage: Record<Stage, number> = normalizeUnlockedByStage(
    legacyUnlockedLevel,
    unlockedByStage
  );

  const setUnlockedForStage = useCallback(
    (stage: Stage, level: number) => {
      if (stage === 1) {
        setLegacyUnlockedLevel((prev) => Math.max(prev, level));
      }
      setUnlockedByStage((prev) => {
        const key = String(stage);
        const current = prev[key] ?? (stage === 1 ? legacyUnlockedLevel : 1);
        return { ...prev, [key]: Math.max(current, level) };
      });
    },
    [setLegacyUnlockedLevel, setUnlockedByStage, legacyUnlockedLevel]
  );

  const recordRunResults = useCallback(
    (
      results: { card: CardId; result: Result; flipTimeMs: number }[],
      level: number,
      passed: boolean,
      livesRemaining?: number,
      stage: Stage = 1
    ) => {
      setCardStats((prev) => {
        const next = { ...prev };
        for (const { card, result, flipTimeMs } of results) {
          const id = cardId(card);
          const cur = next[id] ?? { correct: 0, total: 0, flipTimes: [] };
          next[id] = {
            correct: cur.correct + (result === "gotIt" ? 1 : 0),
            total: cur.total + 1,
            flipTimes: [...cur.flipTimes, flipTimeMs],
          };
        }
        return next;
      });

      if (passed) {
        setUnlockedForStage(stage, level + 1);
        if (livesRemaining !== undefined && results.length > 0) {
          const livesLost = LIVES_PER_LEVEL - livesRemaining;
          const averageTimeMs =
            results.reduce((sum, r) => sum + r.flipTimeMs, 0) / results.length;
          if (stage === 1) {
            setBestRunByLevel((prev) => {
              const current = prev[level];
              if (!isRunBetter(current, livesLost, averageTimeMs)) return prev;
              return { ...prev, [level]: { livesLost, averageTimeMs } };
            });
          } else {
            setBestRunByLevelByStage((prev) => {
              const stageKey = String(stage);
              const stageRuns = prev[stageKey] ?? {};
              const current = stageRuns[level];
              if (!isRunBetter(current, livesLost, averageTimeMs)) return prev;
              return {
                ...prev,
                [stageKey]: { ...stageRuns, [level]: { livesLost, averageTimeMs } },
              };
            });
          }
        }
      }
    },
    [setCardStats, setUnlockedForStage, setBestRunByLevel, setBestRunByLevelByStage]
  );

  const bestRunForLevel = (stage: Stage, lvl: number): BestRun | undefined => {
    if (stage === 1) {
      return (
        bestRunByLevel[lvl] ??
        (bestLivesLostByLevel[lvl] !== undefined
          ? { livesLost: bestLivesLostByLevel[lvl], averageTimeMs: Infinity }
          : undefined)
      );
    }
    const stageRuns = bestRunByLevelByStage[String(stage)];
    return stageRuns?.[lvl];
  };

  return {
    unlockedLevel: legacyUnlockedLevel,
    unlockedLevelByStage,
    cardStats,
    bestLivesLostByLevel,
    bestRunByLevel,
    bestRunForLevel,
    recordRunResults,
  };
}
