import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import { cardId, type CardId } from "./data";
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
const STORAGE_KEY_STATS = "guitarTriadCardStats";
const STORAGE_KEY_BEST_LIVES = "guitarTriadBestLivesLostByLevel";
const STORAGE_KEY_BEST_RUN = "guitarTriadBestRunByLevel";
const LIVES_PER_LEVEL = 3;

function isRunBetter(current: BestRun | undefined, livesLost: number, averageTimeMs: number): boolean {
  if (!current) return true;
  if (livesLost < current.livesLost) return true;
  if (livesLost > current.livesLost) return false;
  return averageTimeMs < current.averageTimeMs;
}

export function useTriadStats() {
  const [unlockedLevel, setUnlockedLevel] = useLocalStorage(STORAGE_KEY_LEVEL, 1);
  const [cardStats, setCardStats] = useLocalStorage<Record<string, CardStat>>(
    STORAGE_KEY_STATS,
    {}
  );
  const [bestLivesLostByLevel, setBestLivesLostByLevel] = useLocalStorage<
    Record<number, number>
  >(STORAGE_KEY_BEST_LIVES, {});
  const [bestRunByLevel, setBestRunByLevel] = useLocalStorage<Record<number, BestRun>>(
    STORAGE_KEY_BEST_RUN,
    {}
  );

  const recordRunResults = useCallback(
    (
      results: { card: CardId; result: Result; flipTimeMs: number }[],
      level: number,
      passed: boolean,
      livesRemaining?: number
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
        setUnlockedLevel((l) => Math.max(l, level + 1));
        if (livesRemaining !== undefined && results.length > 0) {
          const livesLost = LIVES_PER_LEVEL - livesRemaining;
          const averageTimeMs =
            results.reduce((sum, r) => sum + r.flipTimeMs, 0) / results.length;
          setBestRunByLevel((prev) => {
            const current = prev[level];
            if (!isRunBetter(current, livesLost, averageTimeMs)) return prev;
            return { ...prev, [level]: { livesLost, averageTimeMs } };
          });
        }
      }
    },
    [setCardStats, setUnlockedLevel, setBestLivesLostByLevel, setBestRunByLevel]
  );

  const bestRunForLevel = (lvl: number): BestRun | undefined =>
    bestRunByLevel[lvl] ??
    (bestLivesLostByLevel[lvl] !== undefined
      ? { livesLost: bestLivesLostByLevel[lvl], averageTimeMs: Infinity }
      : undefined);

  return {
    unlockedLevel,
    cardStats,
    bestLivesLostByLevel,
    bestRunByLevel,
    bestRunForLevel,
    recordRunResults,
  };
}
