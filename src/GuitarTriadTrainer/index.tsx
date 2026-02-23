import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Flashcard, { type Result } from "./Flashcard";
import { getDeckForLevel, getKeysForLevel, getLevelDeckSize, getSecondsPerCard, getTotalLevels, BOSS_LEVEL, type CardId, type Stage } from "./data";
import { useTriadStats } from "./useTriadStats";
import QandA, { type QAItem } from "../components/QandA";
import ToolPracticeGuide from "../components/ToolPracticeGuide";
import SEO from "../components/SEO";
import WebApplicationSchema from "../components/WebApplicationSchema";
import { BASE_URL } from "../i18n/translations";

type View = "home" | "deck" | "summary";

const LIVES_PER_LEVEL = 3;

/** 1–5 stars: 2 lives lost=1, 1 life lost=2, 0 lives=3, 0 lives in ≤⅔ time=4, 0 lives in <⅓ time=5 */
function getStarRating(livesLost: number, averageTimeMs: number, maxMsPerCard: number): number {
  if (livesLost >= 2) return 1;
  if (livesLost === 1) return 2;
  const oneThirdMs = maxMsPerCard / 3;
  const twoThirdsMs = (maxMsPerCard * 2) / 3;
  if (averageTimeMs < oneThirdMs) return 5;
  if (averageTimeMs <= twoThirdsMs) return 4;
  return 3;
}

function getNextStarCriteria(
  stars: number,
  secondsPerCard: number
): string | null {
  if (stars >= 5) return null;
  const limitSec = secondsPerCard;
  switch (stars) {
    case 1:
      return "Next: 2 stars = finish with ♥♥.";
    case 2:
      return "Next: 3 stars = finish with ♥♥♥.";
    case 3: {
      const fourStarSec = (limitSec * 2) / 3;
      return `Next: 4 stars = ♥♥♥ in under ${fourStarSec < 10 ? fourStarSec.toFixed(1) : Math.round(fourStarSec)}s per card (⅔ of the ${limitSec}s limit).`;
    }
    case 4: {
      const fiveStarSec = limitSec / 3;
      return `Next: 5 stars = ♥♥♥ in under ${fiveStarSec < 10 ? fiveStarSec.toFixed(1) : Math.round(fiveStarSec)}s per card (under ⅓ of the ${limitSec}s limit).`;
    }
    default:
      return null;
  }
}

const FIVE_STAR_CRITERIA = "5 stars = ♥♥♥ in under ⅓ of the time per card.";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What are inversions?",
    answer: (
      <p>
        An <strong>inversion</strong> is a chord (or <Link to="/dictionary/triad" className="link link-primary">triad</Link>) played with a note other than the root in the bass. In <strong>root position</strong> the root is lowest; in <strong>1st inversion</strong> the 3rd is lowest; in <strong>2nd inversion</strong> the 5th is lowest. Same three notes, different order—so the sound is related but the shape on the guitar changes. See our <Link to="/dictionary/chord" className="link link-primary">chord</Link> and <Link to="/dictionary/triad" className="link link-primary">triad</Link> entries for more.
      </p>
    ),
  },
  {
    question: "What is a guitar triad?",
    answer: (
      <p>
        A <Link to="/dictionary/triad" className="link link-primary">triad</Link> is a three-note <Link to="/dictionary/chord" className="link link-primary">chord</Link> built from a root, 3rd, and 5th. On guitar, a “guitar triad” is simply that triad played on a set of strings (here we use the G, B, and high e strings). Major triads use the 1st, 3rd, and 5th notes of the major scale. Learning triads on the top three strings helps you see harmony all over the neck and is a foundation for rhythm and lead playing.
      </p>
    ),
  },
  {
    question: "Why are triads useful?",
    answer: (
      <p>
        <Link to="/dictionary/triad" className="link link-primary">Triads</Link> are the building blocks of harmony: they’re easy to hear, quick to play, and they map cleanly onto the fretboard. Knowing triads in root position and <Link to="/dictionary/chord" className="link link-primary">chord</Link> inversions (1st and 2nd) lets you comp, improvise, and move between keys without relying on full six-string shapes. They also train your ear to hear 1–3–5 and improve sight-reading of chord symbols.
      </p>
    ),
  },
  {
    question: "Are triads 1, 3, 5?",
    answer: (
      <p>
        Yes. A <Link to="/dictionary/triad" className="link link-primary">triad</Link> is built from the <strong>1st</strong> (root), <strong>3rd</strong>, and <strong>5th</strong> scale degrees. For a C major triad that’s C–E–G. The 1/3/5 rule is how we build major and minor triads (and other qualities by changing the 3rd or 5th). Our <Link to="/dictionary/triad" className="link link-primary">triad</Link> dictionary entry explains this in more detail.
      </p>
    ),
  },
  {
    question: "What is the easiest way to learn guitar triads?",
    answer: (
      <p>
        A practical approach: (1) Learn one set of strings (e.g. G–B–e, as in this trainer). (2) Practice one key and one <Link to="/dictionary/triad" className="link link-primary">triad</Link> type (e.g. major) in root position, then add 1st and 2nd <Link to="/dictionary/chord" className="link link-primary">chord</Link> inversions. (3) Use a tool like this one: see the clue, say or play the shape, then check the answer. (4) Add more keys in a logical order (e.g. circle of fifths). Building from one string set and one quality keeps it manageable and transfers well to real playing.
      </p>
    ),
  },
];

const GuitarTriadTrainer = () => {
  const { unlockedLevelByStage, bestRunForLevel, recordRunResults } = useTriadStats();
  const [view, setView] = useState<View>("home");
  const [stage, setStage] = useState<Stage>(1);
  const [deck, setDeck] = useState<CardId[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(LIVES_PER_LEVEL);
  const [flipTimeMs, setFlipTimeMs] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [runResults, setRunResults] = useState<{ card: CardId; result: Result; flipTimeMs: number; lifeLost: boolean }[]>([]);
  const cardShownAtRef = useRef<number>(0);
  const recordedRunRef = useRef(false);
  const currentIndexRef = useRef(0);
  const timeoutDeductedRef = useRef(false);
  const flippedRef = useRef(false);
  const unlockedLevelAtRunStartRef = useRef<number>(1);

  currentIndexRef.current = currentIndex;
  flippedRef.current = flipped;

  const currentCard = deck[currentIndex];
  const isDeckComplete = deck.length > 0 && currentIndex >= deck.length;

  const shuffleDeck = useCallback((cards: CardId[]): CardId[] => {
    const out = [...cards];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }, []);

  const startLevel = useCallback(
    (lvl: number, stg: Stage) => {
      recordedRunRef.current = false;
      unlockedLevelAtRunStartRef.current = unlockedLevelByStage[stg];
      setStage(stg);
      setDeck(shuffleDeck(getDeckForLevel(lvl)));
      setCurrentIndex(0);
      setFlipped(false);
      setLevel(lvl);
      setLives(LIVES_PER_LEVEL);
      setFlipTimeMs(null);
      setRunResults([]);
      timeoutDeductedRef.current = false;
      setView("deck");
    },
    [shuffleDeck, unlockedLevelByStage]
  );

  useEffect(() => {
    if (view === "summary" && !recordedRunRef.current) {
      recordedRunRef.current = true;
      const passed = lives > 0;
      recordRunResults(runResults, level, passed, passed ? lives : undefined, stage);
    }
  }, [view, runResults, level, lives, stage, recordRunResults]);

  useEffect(() => {
    if (view === "deck" && currentCard) {
      cardShownAtRef.current = Date.now();
      timeoutDeductedRef.current = false;
      flippedRef.current = false;
      setElapsedMs(0);
    }
  }, [view, currentCard, currentIndex]);

  const secondsPerCard = getSecondsPerCard(level);
  const maxMsPerCard = secondsPerCard * 1000;

  useEffect(() => {
    if (view !== "deck" || !currentCard) return;
    const tick = () => {
      const elapsed = Math.min(Date.now() - cardShownAtRef.current, maxMsPerCard);
      setElapsedMs(elapsed);
    };
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [view, currentCard, currentIndex, maxMsPerCard]);

  useEffect(() => {
    if (view !== "deck" || !currentCard) return;
    const cardIndexAtStart = currentIndex;
    const timer = window.setTimeout(() => {
      if (currentIndexRef.current !== cardIndexAtStart) return;
      if (timeoutDeductedRef.current) return;
      if (flippedRef.current) return;
      timeoutDeductedRef.current = true;
      setLives((l) => l - 1);
    }, maxMsPerCard);
    return () => window.clearTimeout(timer);
  }, [view, currentCard, currentIndex, maxMsPerCard]);

  useEffect(() => {
    if (view === "deck" && lives <= 0) {
      setView("summary");
    }
  }, [view, lives]);

  const handleFlip = useCallback(() => {
    if (!currentCard || flipped) return;
    setFlipTimeMs(Date.now() - cardShownAtRef.current);
    setFlipped(true);
  }, [currentCard, flipped]);

  const handleResult = useCallback(
    (result: Result, timeMs?: number) => {
      if (!currentCard) return;
      // Only deduct for "miss" if we haven't already deducted for timeout on this card (max 1 life per card)
      if (result === "miss" && !timeoutDeductedRef.current) setLives((l) => l - 1);
      const flipTime = timeMs ?? flipTimeMs ?? 0;
      const lifeLost = timeoutDeductedRef.current || result === "miss";
      setRunResults((prev) => [...prev, { card: currentCard, result, flipTimeMs: flipTime, lifeLost }]);
      if (currentIndex + 1 >= deck.length) {
        setView("summary");
      } else {
        setCurrentIndex((i) => i + 1);
        setFlipped(false);
        setFlipTimeMs(null);
      }
    },
    [currentCard, currentIndex, deck.length, flipTimeMs]
  );

  useEffect(() => {
    if (view !== "deck" || !currentCard) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleFlip();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (flipped) handleResult("gotIt", flipTimeMs ?? undefined);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (flipped) handleResult("miss", flipTimeMs ?? undefined);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, currentCard, flipped, flipTimeMs, handleFlip, handleResult]);

  useEffect(() => {
    if (view !== "summary") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setView("home");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view]);

  return (
    <>
      <SEO
        title="Guitar Triad Trainer | tempotick"
        description="Free guitar triad flashcard trainer. Drill major triads on G–B–e in root, 1st and 2nd inversion. Levels, lives and time limits to build speed and recognition."
        lang="en"
        canonicalPath="/guitar-triad-trainer"
      />
      <WebApplicationSchema
        name="Guitar Triad Trainer"
        url={`${BASE_URL}/guitar-triad-trainer`}
        description="Free guitar triad flashcard trainer. Drill major triads on G–B–e in root, 1st and 2nd inversion. Levels, lives and time limits to build speed and recognition."
        applicationCategory="EducationalApplication"
      />
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Guitar Triad Trainer</h1>

        {view === "home" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-base-300 bg-base-200/50 px-4 py-3 text-left">
              <p className="text-sm text-base-content/70 m-0">
                <strong>3 lives</strong> per level. Lose a life for a wrong answer or if you take over the time limit on a card (see each level). Finish the deck with at least one life to pass and unlock the next level.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-1 text-left">Stage 1</h2>
              <p className="text-sm text-base-content/70 mb-4 text-left">
                Major triads on G-B-e (root, 1st, 2nd inversion). Keys follow the circle of fifths.
              </p>
              <div className="flex flex-col gap-3">
                {Array.from({ length: getTotalLevels() }, (_, i) => i + 1).map(
                  (lvl) => {
                    const keys = getKeysForLevel(lvl);
                    const isUnlocked = lvl <= unlockedLevelByStage[1];
                    const best = bestRunForLevel(1, lvl);
                    return (
                      <div
                        key={lvl}
                        className={`rounded-lg border p-3 flex flex-col gap-2 ${isUnlocked ? "border-base-300 bg-base-200/50" : "border-base-300/50 bg-base-200/30 opacity-75"}`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm ${isUnlocked ? "btn-primary" : "btn-disabled"}`}
                            disabled={!isUnlocked}
                            onClick={() => startLevel(lvl, 1)}
                          >
                            {lvl === BOSS_LEVEL ? `Level ${lvl} (Boss)` : `Level ${lvl}`}
                          </button>
                          <span className="text-sm text-base-content/70">
                            {getLevelDeckSize(lvl)} cards · {getSecondsPerCard(lvl)}s per card
                            {lvl === BOSS_LEVEL ? " · Boss · All keys (random)" : ` · Keys: ${keys.join(", ")}`}
                          </span>
                        </div>
                        {best && (() => {
                          const bestStars = getStarRating(best.livesLost, best.averageTimeMs, getSecondsPerCard(lvl) * 1000);
                          return (
                            <div className="text-sm text-base-content/60 pt-2 border-t border-base-300/70 flex flex-wrap items-center justify-between gap-2">
                              <span className="flex items-center gap-1" role="img" aria-label={`Best run: ${LIVES_PER_LEVEL - best.livesLost} lives left`}>
                                <span className="text-base-content/70 font-medium">Best run:</span>
                                <span aria-hidden>{"♥".repeat(LIVES_PER_LEVEL - best.livesLost)}</span>
                                {best.averageTimeMs < Infinity && (
                                  <span aria-hidden>
                                    {(best.averageTimeMs / 1000) < 10
                                      ? (best.averageTimeMs / 1000).toFixed(1)
                                      : Math.round(best.averageTimeMs / 1000)}s avg
                                  </span>
                                )}
                              </span>
                              <span className="flex items-center gap-0.5 ml-auto" role="img" aria-label={`${bestStars} out of 5 stars`}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <span key={i} className="text-warning text-base" aria-hidden>
                                    {i <= bestStars ? "★" : "☆"}
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-1 text-left">Stage 2</h2>
              <p className="text-sm text-base-content/70 mb-4 text-left">
                Major triads on D-G-B (root, 1st, 2nd inversion). Keys follow the circle of fifths.
              </p>
              <div className="flex flex-col gap-3">
                {Array.from({ length: getTotalLevels() }, (_, i) => i + 1).map(
                  (lvl) => {
                    const keys = getKeysForLevel(lvl);
                    const isUnlocked = lvl <= unlockedLevelByStage[2];
                    const best = bestRunForLevel(2, lvl);
                    return (
                      <div
                        key={`s2-${lvl}`}
                        className={`rounded-lg border p-3 flex flex-col gap-2 ${isUnlocked ? "border-base-300 bg-base-200/50" : "border-base-300/50 bg-base-200/30 opacity-75"}`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm ${isUnlocked ? "btn-primary" : "btn-disabled"}`}
                            disabled={!isUnlocked}
                            onClick={() => startLevel(lvl, 2)}
                          >
                            {lvl === BOSS_LEVEL ? `Level ${lvl} (Boss)` : `Level ${lvl}`}
                          </button>
                          <span className="text-sm text-base-content/70">
                            {getLevelDeckSize(lvl)} cards · {getSecondsPerCard(lvl)}s per card
                            {lvl === BOSS_LEVEL ? " · Boss · All keys (random)" : ` · Keys: ${keys.join(", ")}`}
                          </span>
                        </div>
                        {best && (() => {
                          const bestStars = getStarRating(best.livesLost, best.averageTimeMs, getSecondsPerCard(lvl) * 1000);
                          return (
                            <div className="text-sm text-base-content/60 pt-2 border-t border-base-300/70 flex flex-wrap items-center justify-between gap-2">
                              <span className="flex items-center gap-1" role="img" aria-label={`Best run: ${LIVES_PER_LEVEL - best.livesLost} lives left`}>
                                <span className="text-base-content/70 font-medium">Best run:</span>
                                <span aria-hidden>{"♥".repeat(LIVES_PER_LEVEL - best.livesLost)}</span>
                                {best.averageTimeMs < Infinity && (
                                  <span aria-hidden>
                                    {(best.averageTimeMs / 1000) < 10
                                      ? (best.averageTimeMs / 1000).toFixed(1)
                                      : Math.round(best.averageTimeMs / 1000)}s avg
                                  </span>
                                )}
                              </span>
                              <span className="flex items-center gap-0.5 ml-auto" role="img" aria-label={`${bestStars} out of 5 stars`}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <span key={i} className="text-warning text-base" aria-hidden>
                                    {i <= bestStars ? "★" : "☆"}
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          </div>
        )}

        {view === "deck" && currentCard && !isDeckComplete && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 flex-wrap" role="list" aria-label={`Card ${currentIndex + 1} of ${deck.length}`}>
                {deck.map((_, i) => {
                  const done = i < runResults.length;
                  const lifeLost = done && runResults[i].lifeLost;
                  const current = i === currentIndex;
                  return (
                    <span
                      key={i}
                      role="listitem"
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm shrink-0 ${current
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100 bg-primary/20"
                          : done
                            ? lifeLost
                              ? "bg-error/15 text-error"
                              : "bg-success/15 text-success"
                            : "bg-base-300/60 text-base-content/40"
                        }`}
                      aria-label={current ? `Card ${i + 1} (current)` : done ? `Card ${i + 1}: ${lifeLost ? "life lost" : "correct"}` : `Card ${i + 1}: not yet attempted`}
                    >
                      {done ? (
                        lifeLost ? (
                          <span aria-hidden>✗</span>
                        ) : (
                          <span aria-hidden>✓</span>
                        )
                      ) : current ? (
                        <span className="font-semibold" aria-hidden>{i + 1}</span>
                      ) : (
                        <span aria-hidden>{i + 1}</span>
                      )}
                    </span>
                  );
                })}
              </div>
              <p className="text-sm font-medium text-base-content/80 flex shrink-0 gap-1" aria-live="polite">
                <span>{"♥".repeat(lives)}</span>
                <span>Lives</span>
              </p>
            </div>
            <p className="text-sm text-base-content/50 -mt-2">Stage {stage} · Level {level}</p>
            <Flashcard
              card={currentCard}
              stage={stage}
              flipped={flipped}
              timeProgress={Math.min(1, elapsedMs / maxMsPerCard)}
              secondsPerCard={secondsPerCard}
              onFlip={handleFlip}
              onResult={handleResult}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setView("home")}
              aria-label="Back to start"
            >
              Back to start
            </button>
          </div>
        )}

        {view === "summary" && (() => {
          const n = runResults.length;
          const correct = runResults.filter((r) => r.result === "gotIt").length;
          const accuracyPct = n > 0 ? Math.round((correct / n) * 100) : 0;
          const passed = lives > 0;
          const mastered = passed && level < getTotalLevels();
          const averageTimeMs = n > 0 ? runResults.reduce((s, r) => s + r.flipTimeMs, 0) / n : 0;
          const averageTimeSec = averageTimeMs / 1000;
          const secondsPerCard = getSecondsPerCard(level);
          const maxMsPerCard = secondsPerCard * 1000;
          const livesLost = LIVES_PER_LEVEL - lives;
          const stars = passed ? getStarRating(livesLost, averageTimeMs, maxMsPerCard) : 0;
          const nextCriteria = passed ? getNextStarCriteria(stars, secondsPerCard) : null;
          return (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                {passed ? (
                  <>
                    <h2 className="card-title justify-center text-center gap-2" role="img" aria-label={`Level complete, ${lives} lives left`}>
                      <span>Level complete</span>
                      <span aria-hidden>{"♥".repeat(lives)}</span>
                    </h2>
                    {mastered && level + 1 > unlockedLevelAtRunStartRef.current && (
                      <p className="text-success font-medium mt-1">
                        Level {level + 1} unlocked!
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-1 mt-2" role="img" aria-label={`${stars} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="text-xl text-warning" aria-hidden>
                          {i <= stars ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    {nextCriteria && (
                      <p className="text-sm text-base-content/70 mt-1">
                        {nextCriteria}
                      </p>
                    )}
                    <p className="text-sm text-base-content/60 mt-0.5">
                      {stars === 5 ? `Maximum stars! ${FIVE_STAR_CRITERIA}` : FIVE_STAR_CRITERIA}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="card-title text-2xl">Out of lives</h2>
                    <p className="text-4xl mb-2" aria-hidden>🎸</p>
                    <p className="text-base-content/80 font-medium">
                      Level {level} got the best of you this time.
                    </p>
                    <p className="text-base-content/70 text-sm mt-1">
                      No worries — triads take practice. Have another go when you’re ready.
                    </p>
                  </>
                )}
                <p className="text-base-content/90 mt-2">
                  Accuracy: <strong>{accuracyPct}%</strong> ({correct}/{n} correct)
                </p>
                {n > 0 && (
                  <p className="text-base-content/90 mt-0.5">
                    Average time: <strong>{averageTimeSec < 10 ? averageTimeSec.toFixed(1) : Math.round(averageTimeSec)}s</strong> per card
                  </p>
                )}
                <div className="card-actions justify-center mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setView("home")}
                    aria-label="Back to start (Space)"
                  >
                    Back to start (Space)
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="divider my-8" />
        <section className="text-left">
          <h2 className="text-xl font-semibold mb-2">Why it's useful</h2>
          <p className="text-sm text-base-content/70 mb-2">
            I made this to replicate the feeling of finding triads in a jam night.
          </p>
          <p className="text-sm text-base-content/70 mb-2">
            You only have a certain amount of time to find the right shape by the time the song gets to it, and you typically want the right shape in the section of the neck you're playing on.
          </p>
          <p className="text-sm text-base-content/70 mb-2">
            This game aims to replicate that feeling, drilling in the ability to find the nearest triad shape for the chord you want with time pressure.
          </p>
          <p className="text-sm text-base-content/70 m-0">
            I hope it helps you!
          </p>
        </section>
        <div className="divider my-8" />
        <ToolPracticeGuide
          title="How to Practice with the Guitar Triad Trainer"
          features={[
            "Stage 1: major triads on G–B–e; Stage 2: major triads on D–G–B (root, 1st, 2nd inversion)",
            "Levels by key (circle of fifths) plus a Boss level with all keys",
            "3 lives per run — wrong answers and timeouts cost a life",
            "Time limit per card (e.g. 8s or 6s) to build quick recognition",
            "Keyboard shortcuts — Space to flip, ← / → to mark Got it / Miss",
            "Free — no ads, no account",
          ]}
          howToUseSteps={[
            "Pick a level (start at Level 1). Each level adds more keys; the Boss level mixes all keys.",
            "Start the deck. You’ll see a clue: the string set (G–B–e), which chord tone is in the bass (root, 1st, or 2nd inversion), and the key.",
            "Say or play the triad shape, then flip the card (click or press Space) to see the answer.",
            "Mark yourself: Got it (or press →) if you were right, Miss (or press ←) if you weren’t. Wrong answers and timeouts cost a life.",
            "Finish the deck with at least one life to pass and unlock the next level. Replay levels to improve your best run.",
          ]}
          exampleRoutine={
            <>
              <p className="m-0">
                <strong>Warm-up (5 min):</strong> Level 1, one run. Focus on naming the shape before you flip.
              </p>
              <p className="m-0">
                <strong>Main (10–15 min):</strong> Your highest unlocked level. Do 2–3 runs; aim to pass with 2–3 lives left.
              </p>
              <p className="m-0">
                <strong>Cool-down (5 min):</strong> Replay a level you’ve passed and try to finish with 3 lives (no misses, no timeouts).
              </p>
            </>
          }
          settingsExplained={
            <>
              <p className="m-0">
                <strong>Stages:</strong> Stage 1 = G–B–e, Stage 2 = D–G–B. Each has major triads in root, 1st, and 2nd inversion. Keys follow the circle of fifths (Level 1 = fewer keys, Boss = all keys). Each level shows deck size and seconds per card.
              </p>
              <p className="m-0 mt-1.5">
                <strong>Lives & time:</strong> You get 3 lives per run. You lose a life for a wrong answer or if you don’t flip before the time limit. The limit (e.g. 8s or 6s per card) is shown on the level button.
              </p>
              <p className="m-0 mt-1.5">
                <strong>Progress:</strong> “Best” shows the fewest lives you’ve lost on a successful run for that level. Use it to see when you’re ready to move on or to challenge yourself to cleaner runs.
              </p>
            </>
          }
          otherTools={[
            { path: "/chord-progression-trainer", name: "Chord progression trainer" },
            { path: "/online-metronome", name: "Online metronome" },
          ]}
        />
        <div className="divider my-8" />
        <QandA items={FAQ_ITEMS} />
      </div>
    </>
  );
};

export default GuitarTriadTrainer;
