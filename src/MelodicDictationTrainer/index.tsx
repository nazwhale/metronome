import { useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import QandA, { QAItem } from "../components/QandA";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What is melodic dictation?",
    answer: (
      <p>
        Melodic dictation is an ear training exercise where you listen to a melody
        and write down or identify the notes you hear. It's a fundamental skill for
        musicians that helps develop your ability to recognize pitch relationships
        and internalize musical patterns. This tool uses solfege syllables (do, re, mi, etc.)
        to help you identify scale degrees in the major scale.
      </p>
    ),
  },
  {
    question: "What is solfege?",
    answer: (
      <p>
        Solfege (or solfège) is a music education method that assigns syllables to
        each note of the scale: <strong>Do-Re-Mi-Fa-Sol-La-Ti</strong>. In "fixed Do"
        systems, Do always represents C. In "moveable Do" systems (used here), Do
        represents the tonic (first note) of whatever key you're in. This makes it
        easier to hear and understand the relationships between notes regardless of
        the actual pitches.
      </p>
    ),
  },
  {
    question: "What is the 'Play Do' button for?",
    answer: (
      <p>
        The "Play Do" button plays a reference C note (the tonic). This grounds your
        ear in the key by establishing Do (the home note). Use it before or after
        hearing the melody to help you hear the other notes relative to the tonic.
        Professional ear training always starts with establishing the key before
        testing melodic recognition.
      </p>
    ),
  },
  {
    question: "How can I improve at melodic dictation?",
    answer: (
      <div>
        <p className="mb-2">Here are some tips to improve:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Start by learning to sing the major scale with solfege</li>
          <li>Listen for the "feeling" each scale degree has relative to Do</li>
          <li>Practice singing back melodies before trying to identify them</li>
          <li>Focus on intervals: Mi feels like a "bright" major 3rd from Do</li>
          <li>Sol has a strong, stable feeling (perfect 5th)</li>
          <li>Ti has tension that wants to resolve up to Do</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What are the scale degrees in major?",
    answer: (
      <div>
        <p className="mb-2">
          The major scale has 7 notes, each with a solfege name and scale degree number:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Do (1)</strong> - Tonic, home base, feels resolved</li>
          <li><strong>Re (2)</strong> - Supertonic, slight upward pull</li>
          <li><strong>Mi (3)</strong> - Mediant, bright and happy</li>
          <li><strong>Fa (4)</strong> - Subdominant, wants to move down to Mi</li>
          <li><strong>Sol (5)</strong> - Dominant, strong and stable</li>
          <li><strong>La (6)</strong> - Submediant, gentle, slightly melancholic</li>
          <li><strong>Ti (7)</strong> - Leading tone, strong pull up to Do</li>
        </ul>
      </div>
    ),
  },
];

// Scale degrees in C major
const SCALE_NOTES = {
  Do: { name: "Do", note: "C4", degree: 1 },
  Re: { name: "Re", note: "D4", degree: 2 },
  Mi: { name: "Mi", note: "E4", degree: 3 },
  Fa: { name: "Fa", note: "F4", degree: 4 },
  Sol: { name: "Sol", note: "G4", degree: 5 },
  La: { name: "La", note: "A4", degree: 6 },
  Ti: { name: "Ti", note: "B4", degree: 7 },
};

type SolfegeName = keyof typeof SCALE_NOTES;

const SOLFEGE_NAMES: SolfegeName[] = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti"];

// Create a synth for playing notes
const createMelodySynth = () => {
  return new Tone.Synth({
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.3,
      release: 0.5,
    },
  }).toDestination();
};

const MelodicDictationTrainer = () => {
  const isEmbed = useIsEmbed();
  const [melody, setMelody] = useState<SolfegeName[]>([]);
  const [userAnswer, setUserAnswer] = useState<SolfegeName[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [playingReference, setPlayingReference] = useState(false);
  const [melodyLength, setMelodyLength] = useState(4);
  const [availableNoteCount, setAvailableNoteCount] = useState(7);

  const synthRef = useRef<Tone.Synth | null>(null);

  // Get the available notes based on the count (always starts from Do)
  const availableNotes = SOLFEGE_NAMES.slice(0, availableNoteCount);

  // Generate a new random melody
  const generateNewMelody = useCallback(() => {
    const notes = SOLFEGE_NAMES.slice(0, availableNoteCount);
    const newMelody: SolfegeName[] = [];
    for (let i = 0; i < melodyLength; i++) {
      const randomIndex = Math.floor(Math.random() * notes.length);
      newMelody.push(notes[randomIndex]);
    }
    setMelody(newMelody);
    setUserAnswer([]);
    setIsRevealed(false);
    setHasStarted(true);
  }, [melodyLength, availableNoteCount]);

  // Play the reference C note
  const playReference = useCallback(async () => {
    await Tone.start();

    if (!synthRef.current) {
      synthRef.current = createMelodySynth();
    }

    setPlayingReference(true);
    synthRef.current.triggerAttackRelease("C4", "2n");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setPlayingReference(false);
  }, []);

  // Play the melody
  const playMelody = useCallback(async () => {
    if (melody.length === 0 || isPlaying) return;

    await Tone.start();

    if (!synthRef.current) {
      synthRef.current = createMelodySynth();
    }

    setIsPlaying(true);

    const noteDuration = 0.5; // seconds per note
    const gap = 0.15; // gap between notes

    for (let i = 0; i < melody.length; i++) {
      setCurrentNoteIndex(i);
      const note = SCALE_NOTES[melody[i]].note;
      synthRef.current.triggerAttackRelease(note, noteDuration);
      await new Promise((resolve) =>
        setTimeout(resolve, (noteDuration + gap) * 1000)
      );
    }

    setCurrentNoteIndex(null);
    setIsPlaying(false);
  }, [melody, isPlaying]);

  // Handle solfege selection
  const handleSelectNote = (note: SolfegeName) => {
    if (isRevealed || userAnswer.length >= melodyLength) return;

    const newAnswer = [...userAnswer, note];
    setUserAnswer(newAnswer);

    // Auto-reveal if all notes are selected
    if (newAnswer.length === melodyLength) {
      setIsRevealed(true);
    }
  };

  // Remove the last selected note
  const handleUndo = () => {
    if (userAnswer.length === 0 || isRevealed) return;
    setUserAnswer(userAnswer.slice(0, -1));
  };

  // Check if the answer is correct
  const isCorrect = () => {
    if (userAnswer.length !== melody.length) return false;
    return userAnswer.every((note, index) => note === melody[index]);
  };

  // Get styling for answer slots
  const getSlotStyle = (index: number) => {
    const baseStyle =
      "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-sm sm:text-base font-bold rounded-lg transition-all";

    if (currentNoteIndex === index && isPlaying) {
      return `${baseStyle} bg-primary text-primary-content scale-110`;
    }

    if (!isRevealed) {
      if (index < userAnswer.length) {
        return `${baseStyle} bg-base-300`;
      }
      return `${baseStyle} bg-base-200 border-2 border-dashed border-base-300`;
    }

    // Revealed state
    if (index < userAnswer.length) {
      if (userAnswer[index] === melody[index]) {
        return `${baseStyle} bg-success text-success-content`;
      }
      return `${baseStyle} bg-error text-error-content`;
    }

    return `${baseStyle} bg-base-200`;
  };

  // Get styling for solfege buttons
  const getSolfegeButtonStyle = () => {
    const baseStyle = "btn min-w-12 h-12 sm:min-w-14 sm:h-14 text-sm sm:text-base font-bold";

    if (isRevealed) {
      return `${baseStyle} btn-disabled opacity-50`;
    }

    return `${baseStyle} btn-outline btn-primary`;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Melodic Dictation Trainer</h1>
        <p className="text-sm text-base-content/70">
          Listen to the melody and identify the notes using solfege
        </p>
      </div>

      {!hasStarted ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-base-content/70 mb-4">
            Train your ear! A melody will play. Use the "Play Do" button to
            ground yourself in the key, then identify each note using solfege syllables.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Melody Length</span>
              </label>
              <select
                className="select select-bordered"
                value={melodyLength}
                onChange={(e) => setMelodyLength(Number(e.target.value))}
              >
                <option value={2}>2 notes</option>
                <option value={3}>3 notes</option>
                <option value={4}>4 notes</option>
                <option value={5}>5 notes</option>
                <option value={6}>6 notes</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Scale Notes</span>
              </label>
              <select
                className="select select-bordered"
                value={availableNoteCount}
                onChange={(e) => setAvailableNoteCount(Number(e.target.value))}
              >
                <option value={3}>Do Re Mi (3)</option>
                <option value={4}>Do Re Mi Fa (4)</option>
                <option value={5}>Do Re Mi Fa Sol (5)</option>
                <option value={6}>Do Re Mi Fa Sol La (6)</option>
                <option value={7}>All 7 notes</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-lg mt-4" onClick={generateNewMelody}>
            Start Training
          </button>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body items-center py-4">
              <div className="flex gap-2 flex-wrap justify-center items-center">
                <button
                  className={`btn btn-primary ${isPlaying ? "loading" : ""}`}
                  onClick={playMelody}
                  disabled={isPlaying || playingReference}
                >
                  {isPlaying ? "Playing..." : "Play Melody"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={playReference}
                  disabled={isPlaying}
                >
                  Play Do (C)
                </button>
                <select
                  className="select select-bordered select-sm"
                  value={melodyLength}
                  onChange={(e) => {
                    const newLength = Number(e.target.value);
                    setMelodyLength(newLength);
                    // Generate new melody with the new length
                    const notes = SOLFEGE_NAMES.slice(0, availableNoteCount);
                    const newMelody: SolfegeName[] = [];
                    for (let i = 0; i < newLength; i++) {
                      const randomIndex = Math.floor(Math.random() * notes.length);
                      newMelody.push(notes[randomIndex]);
                    }
                    setMelody(newMelody);
                    setUserAnswer([]);
                    setIsRevealed(false);
                  }}
                  disabled={isPlaying}
                >
                  <option value={2}>2 notes</option>
                  <option value={3}>3 notes</option>
                  <option value={4}>4 notes</option>
                  <option value={5}>5 notes</option>
                  <option value={6}>6 notes</option>
                </select>
                <select
                  className="select select-bordered select-sm"
                  value={availableNoteCount}
                  onChange={(e) => {
                    const newCount = Number(e.target.value);
                    setAvailableNoteCount(newCount);
                    // Generate new melody with the new available notes
                    const notes = SOLFEGE_NAMES.slice(0, newCount);
                    const newMelody: SolfegeName[] = [];
                    for (let i = 0; i < melodyLength; i++) {
                      const randomIndex = Math.floor(Math.random() * notes.length);
                      newMelody.push(notes[randomIndex]);
                    }
                    setMelody(newMelody);
                    setUserAnswer([]);
                    setIsRevealed(false);
                  }}
                  disabled={isPlaying}
                >
                  <option value={3}>Do Re Mi</option>
                  <option value={4}>Do Re Mi Fa</option>
                  <option value={5}>Do Re Mi Fa Sol</option>
                  <option value={6}>Do Re Mi Fa Sol La</option>
                  <option value={7}>All</option>
                </select>
              </div>
            </div>
          </div>

          {/* Answer slots */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body items-center">
              <h2 className="card-title text-sm mb-4">Your Answer</h2>
              <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                {Array.from({ length: melodyLength }, (_, index) => (
                  <div key={index} className={getSlotStyle(index)}>
                    {isRevealed && userAnswer[index] !== melody[index] ? (
                      <div className="flex flex-col items-center text-xs">
                        <span className="line-through opacity-70">
                          {userAnswer[index] || "—"}
                        </span>
                        <span className="text-success font-bold">
                          {melody[index]}
                        </span>
                      </div>
                    ) : (
                      userAnswer[index] || "—"
                    )}
                  </div>
                ))}
              </div>
              {!isRevealed && userAnswer.length > 0 && (
                <button
                  className="btn btn-ghost btn-sm mt-3"
                  onClick={handleUndo}
                >
                  Undo
                </button>
              )}
            </div>
          </div>

          {/* Solfege selection buttons */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <h2 className="text-sm font-semibold">Select Notes ({userAnswer.length}/{melodyLength})</h2>
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
              {availableNotes.map((note) => (
                <button
                  key={note}
                  className={getSolfegeButtonStyle()}
                  onClick={() => handleSelectNote(note)}
                  disabled={isRevealed || userAnswer.length >= melodyLength}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Result message */}
          {isRevealed && (
            <div
              className={`alert ${isCorrect() ? "alert-success" : "alert-error"} mb-6`}
            >
              <span>
                {isCorrect()
                  ? `Perfect! You got all ${melodyLength} notes correct!`
                  : `Not quite. The melody was: ${melody.join(" - ")}`}
              </span>
            </div>
          )}

          {/* Next question button */}
          {isRevealed && (
            <div className="flex justify-center">
              <button className="btn btn-primary" onClick={generateNewMelody}>
                Next Melody
              </button>
            </div>
          )}
        </>
      )}

      {/* Embed Button - hidden in embed mode */}
      {!isEmbed && (
        <div className="flex justify-center mt-6">
          <EmbedButton
            embedPath="/embed/melodic-dictation"
            canonicalPath="/melodic-dictation-trainer"
            height={560}
            toolName="Melodic Dictation Trainer"
          />
        </div>
      )}

      {/* Reference and FAQ - hidden in embed mode */}
      {!isEmbed && (
        <>
          <div className="divider my-8" />
          <div className="text-sm text-base-content/70">
            <h3 className="font-semibold mb-2">Solfege Reference (Key of C):</h3>
            <ul className="grid grid-cols-2 gap-1">
              <li><span className="font-mono">Do (1)</span> - C</li>
              <li><span className="font-mono">Re (2)</span> - D</li>
              <li><span className="font-mono">Mi (3)</span> - E</li>
              <li><span className="font-mono">Fa (4)</span> - F</li>
              <li><span className="font-mono">Sol (5)</span> - G</li>
              <li><span className="font-mono">La (6)</span> - A</li>
              <li><span className="font-mono">Ti (7)</span> - B</li>
            </ul>
          </div>

          <div className="divider my-8" />
          <QandA items={FAQ_ITEMS} />
        </>
      )}
    </div>
  );
};

export default MelodicDictationTrainer;
