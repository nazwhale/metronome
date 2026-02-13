import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Flashcard, { type Result } from "./Flashcard";
import { getDeckForLevel, getKeysForLevel, getLevelDeckSize, getSecondsPerCard, getTotalLevels, BOSS_LEVEL, type CardId } from "./data";
import { useTriadStats } from "./useTriadStats";
import QandA, { type QAItem } from "../components/QandA";

type View = "home" | "deck" | "summary";

const LIVES_PER_LEVEL = 3;

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
  const { unlockedLevel, bestLivesLostByLevel, recordRunResults } = useTriadStats();
  const [view, setView] = useState<View>("home");
  const [deck, setDeck] = useState<CardId[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(LIVES_PER_LEVEL);
  const [flipTimeMs, setFlipTimeMs] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [runResults, setRunResults] = useState<{ card: CardId; result: Result; flipTimeMs: number }[]>([]);
  const cardShownAtRef = useRef<number>(0);
  const recordedRunRef = useRef(false);
  const currentIndexRef = useRef(0);
  const timeoutDeductedRef = useRef(false);
  const flippedRef = useRef(false);

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
    (lvl: number) => {
      recordedRunRef.current = false;
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
    [shuffleDeck]
  );

  useEffect(() => {
    if (view === "summary" && !recordedRunRef.current) {
      recordedRunRef.current = true;
      const passed = lives > 0;
      recordRunResults(runResults, level, passed, passed ? lives : undefined);
    }
  }, [view, runResults, level, lives, recordRunResults]);

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
      if (result === "miss") setLives((l) => l - 1);
      const flipTime = timeMs ?? flipTimeMs ?? 0;
      setRunResults((prev) => [...prev, { card: currentCard, result, flipTimeMs: flipTime }]);
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

  return (
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
                  const isUnlocked = lvl <= unlockedLevel;
                  return (
                    <div
                      key={lvl}
                      className={`rounded-lg border p-3 ${isUnlocked ? "border-base-300 bg-base-200/50" : "border-base-300/50 bg-base-200/30 opacity-75"}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm ${isUnlocked ? "btn-primary" : "btn-disabled"}`}
                          disabled={!isUnlocked}
                          onClick={() => startLevel(lvl)}
                        >
                          {lvl === BOSS_LEVEL ? `Level ${lvl} (Boss)` : `Level ${lvl}`}
                        </button>
                        <span className="text-sm text-base-content/70">
                          {getLevelDeckSize(lvl)} cards · {getSecondsPerCard(lvl)}s per card
                          {lvl === BOSS_LEVEL ? " · Boss · All keys (random)" : ` · Keys: ${keys.join(", ")}`}
                          {bestLivesLostByLevel[lvl] !== undefined && (
                            <span className="ml-1 text-base-content/60">
                              · Best: {bestLivesLostByLevel[lvl] === 0 ? "0 lives lost" : `${bestLivesLostByLevel[lvl]} lives lost`}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-1 text-left">Stage 2</h2>
            <p className="text-sm text-base-content/70 mb-2 text-left">
              Minor & major triads.
            </p>
            <p className="text-sm text-base-content/50 italic text-left">Coming soon.</p>
          </section>
        </div>
      )}

      {view === "deck" && currentCard && !isDeckComplete && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">
              Card {currentIndex + 1} of {deck.length} · Level {level}
            </p>
            <p className="text-sm font-medium text-base-content/80 min-w-[5rem] flex justify-end gap-1" aria-live="polite">
              <span>{"♥".repeat(lives)}</span>
              <span>Lives</span>
            </p>
          </div>
          <Flashcard
            card={currentCard}
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
        return (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{passed ? "Level complete" : "Out of lives"}</h2>
              <p className="text-base-content/80">
                {passed
                  ? `Level ${level} complete with ${lives} life${lives === 1 ? "" : "s"} left.`
                  : `Level ${level} – no lives left.`}
              </p>
              {mastered && (
                <p className="text-success font-medium mt-1">
                  Level {level + 1} unlocked!
                </p>
              )}
              {!passed && (
                <p className="text-base-content/70 text-sm mt-1">
                  Finish the deck with at least one life to pass.
                </p>
              )}
              <p className="text-base-content/90 mt-2">
                Accuracy: <strong>{accuracyPct}%</strong> ({correct}/{n} correct)
              </p>
              <div className="card-actions justify-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setView("home")}
                  aria-label="Back to start"
                >
                  Back to start
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="divider my-8" />
      <QandA items={FAQ_ITEMS} />
    </div>
  );
};

export default GuitarTriadTrainer;
