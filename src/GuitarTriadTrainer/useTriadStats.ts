import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import { cardId, type CardId } from "./data";
import type { Result } from "./Flashcard";

export interface CardStat {
  correct: number;
  total: number;
  flipTimes: number[];
}

const STORAGE_KEY_LEVEL = "guitarTriadUnlockedLevel";
const STORAGE_KEY_STATS = "guitarTriadCardStats";
const STORAGE_KEY_BEST_LIVES = "guitarTriadBestLivesLostByLevel";
const LIVES_PER_LEVEL = 3;

export function useTriadStats() {
  const [unlockedLevel, setUnlockedLevel] = useLocalStorage(STORAGE_KEY_LEVEL, 1);
  const [cardStats, setCardStats] = useLocalStorage<Record<string, CardStat>>(
    STORAGE_KEY_STATS,
    {}
  );
  const [bestLivesLostByLevel, setBestLivesLostByLevel] = useLocalStorage<
    Record<number, number>
  >(STORAGE_KEY_BEST_LIVES, {});

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
        if (livesRemaining !== undefined) {
          const livesLost = LIVES_PER_LEVEL - livesRemaining;
          setBestLivesLostByLevel((prev) => ({
            ...prev,
            [level]: Math.min(prev[level] ?? Infinity, livesLost),
          }));
        }
      }
    },
    [setCardStats, setUnlockedLevel, setBestLivesLostByLevel]
  );

  return {
    unlockedLevel,
    cardStats,
    bestLivesLostByLevel,
    recordRunResults,
  };
}
