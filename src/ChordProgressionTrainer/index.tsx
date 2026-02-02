import { useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import QandA, { QAItem } from "../components/QandA";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "What is the popular 4 chord progression?",
    answer: (
      <p>
        The most popular 4 chord progression is <strong>I – V – vi – IV</strong>, 
        often called the "pop progression" or "axis progression." In the key of C, 
        this is C – G – Am – F. It's used in countless hit songs including "Let It Be" 
        by The Beatles, "No Woman No Cry" by Bob Marley, "With or Without You" by U2, 
        and many modern pop songs. Its popularity comes from the satisfying way it 
        creates tension and resolution while maintaining an uplifting feel.
      </p>
    ),
  },
  {
    question: "What is the 1/3/5 rule for chords?",
    answer: (
      <p>
        The 1/3/5 rule refers to how basic triads (three-note chords) are built. 
        You take the 1st note (root), 3rd note, and 5th note of a scale to form a chord. 
        For example, in C major: C (1) – E (3) – G (5) creates a C major chord. 
        For minor chords, the 3rd is lowered by a half step: C – E♭ – G creates C minor. 
        This formula is the foundation of all chord construction in Western music.
      </p>
    ),
  },
  {
    question: "What are some good chord progressions?",
    answer: (
      <div>
        <p className="mb-2">Here are some of the most useful chord progressions to learn:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>I – IV – V – I</strong> (C – F – G – C) – The classic rock/blues progression</li>
          <li><strong>I – V – vi – IV</strong> (C – G – Am – F) – The pop progression</li>
          <li><strong>I – vi – IV – V</strong> (C – Am – F – G) – The 50s/doo-wop progression</li>
          <li><strong>ii – V – I</strong> (Dm – G – C) – The essential jazz progression</li>
          <li><strong>vi – IV – I – V</strong> (Am – F – C – G) – Minor key pop progression</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What are common chord progressions?",
    answer: (
      <p>
        The most common chord progressions use the I, IV, V, and vi chords from the major scale. 
        These four chords appear in the vast majority of popular music because they sound naturally 
        good together. The I chord feels like "home," the IV and V chords create movement and tension, 
        and the vi chord adds emotional depth. By combining these four chords in different orders, 
        you can create thousands of songs across rock, pop, country, folk, and many other genres.
      </p>
    ),
  },
  {
    question: "What are the ice cream changes (or 50s progression)?",
    answer: (
      <p>
        The "ice cream changes" or "50s progression" is <strong>I – vi – IV – V</strong> (in C: C – Am – F – G). 
        It gets its name from its prevalence in 1950s doo-wop and early rock and roll—the era of ice cream 
        parlors and sock hops. You'll hear it in classics like "Stand By Me," "Earth Angel," "Every Breath 
        You Take," and countless others. It creates a nostalgic, romantic feel that's still widely used today.
      </p>
    ),
  },
  {
    question: "What is the Andalusian cadence?",
    answer: (
      <p>
        The Andalusian cadence is a descending chord progression originating from flamenco music: 
        <strong> i – ♭VII – ♭VI – V</strong> (in A minor: Am – G – F – E). It creates a dramatic, 
        Spanish-flavored sound with a strong pull toward resolution. You'll hear it in "Hit the Road Jack," 
        "Smooth" by Santana, "Runaway" by Del Shannon, and throughout flamenco and classical Spanish guitar music. 
        The progression descends stepwise in the bass, creating a distinctive falling sensation.
      </p>
    ),
  },
  {
    question: "What are the 12 bar blues changes?",
    answer: (
      <div>
        <p className="mb-2">
          The 12 bar blues is the foundation of blues, rock, and jazz. It's a 12-measure form using only the I, IV, and V chords:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Bars 1-4:</strong> I – I – I – I</li>
          <li><strong>Bars 5-8:</strong> IV – IV – I – I</li>
          <li><strong>Bars 9-12:</strong> V – IV – I – V (turnaround)</li>
        </ul>
        <p className="mt-2">
          In C, that's: C – C – C – C – F – F – C – C – G – F – C – G. Countless songs use this form, 
          from "Johnny B. Goode" to "Hound Dog" to modern blues-rock.
        </p>
      </div>
    ),
  },
  {
    question: "What is the Axis Progression?",
    answer: (
      <p>
        The Axis Progression is <strong>I – V – vi – IV</strong> (in C: C – G – Am – F), also called the 
        "pop-punk progression" or "sensitive female chord progression." It's arguably the most common 
        progression in modern pop music. Songs using it include "Let It Be," "No Woman No Cry," "With or 
        Without You," "Someone Like You," and hundreds more. The name comes from the "Axis of Awesome" 
        comedy group who famously demonstrated how many hit songs share these exact four chords.
      </p>
    ),
  },
];

// Diatonic chords in C major (using Roman numeral notation)
// I, ii, iii, IV, V, vi
const CHORDS = {
  I: { name: "I", notes: ["C4", "E4", "G4"], quality: "major" },
  ii: { name: "ii", notes: ["D4", "F4", "A4"], quality: "minor" },
  iii: { name: "iii", notes: ["E4", "G4", "B4"], quality: "minor" },
  IV: { name: "IV", notes: ["F4", "A4", "C5"], quality: "major" },
  V: { name: "V", notes: ["G4", "B4", "D5"], quality: "major" },
  vi: { name: "vi", notes: ["A4", "C5", "E5"], quality: "minor" },
};

type ChordKey = keyof typeof CHORDS;

const CHORD_KEYS: ChordKey[] = ["I", "ii", "iii", "IV", "V", "vi"];

// Common chord progressions to use as templates
const PROGRESSIONS: ChordKey[][] = [
  ["I", "IV", "V", "I"],
  ["I", "V", "vi", "IV"],
  ["I", "vi", "IV", "V"],
  ["ii", "V", "I", "I"],
  ["I", "IV", "vi", "V"],
  ["vi", "IV", "I", "V"],
  ["I", "ii", "IV", "V"],
  ["I", "iii", "IV", "V"],
  ["I", "IV", "I", "V"],
  ["vi", "ii", "V", "I"],
];

// Create a synth for playing chords
const createChordSynth = () => {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
    },
  }).toDestination();
};

const ChordProgressionTrainer = () => {
  const isEmbed = useIsEmbed();
  const [progression, setProgression] = useState<ChordKey[]>([]);
  const [hiddenIndex, setHiddenIndex] = useState<number>(0);
  const [options, setOptions] = useState<ChordKey[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<ChordKey | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  const synthRef = useRef<Tone.PolySynth | null>(null);

  // Generate a new quiz question
  const generateNewQuestion = useCallback(() => {
    // Pick a random progression
    const randomProgression = PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];
    
    // Pick a random position to hide (0-3)
    const randomHiddenIndex = Math.floor(Math.random() * 4);
    
    // The correct answer is the chord at the hidden position
    const correctAnswer = randomProgression[randomHiddenIndex];
    
    // Generate 3 wrong options (different from the correct answer)
    const wrongOptions = CHORD_KEYS.filter(
      (key) => key !== correctAnswer
    );
    
    // Shuffle and take 3 wrong options
    const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine correct answer with wrong options and shuffle
    const allOptions = [correctAnswer, ...shuffledWrong].sort(() => Math.random() - 0.5);
    
    setProgression(randomProgression);
    setHiddenIndex(randomHiddenIndex);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHasStarted(true);
  }, []);

  // Play the chord progression
  const playProgression = useCallback(async () => {
    if (progression.length === 0 || isPlaying) return;
    
    await Tone.start();
    
    if (!synthRef.current) {
      synthRef.current = createChordSynth();
    }
    
    setIsPlaying(true);
    
    const chordDuration = 0.8; // seconds per chord
    const gap = 0.2; // gap between chords
    
    for (let i = 0; i < progression.length; i++) {
      setCurrentChordIndex(i);
      const chord = CHORDS[progression[i]];
      synthRef.current.triggerAttackRelease(chord.notes, chordDuration);
      await new Promise((resolve) => setTimeout(resolve, (chordDuration + gap) * 1000));
    }
    
    setCurrentChordIndex(null);
    setIsPlaying(false);
  }, [progression, isPlaying]);

  // Handle answer selection
  const handleAnswerSelect = (answer: ChordKey) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answer);
    const correct = answer === progression[hiddenIndex];
    setIsCorrect(correct);
  };

  // Get display text for a chord position
  const getChordDisplay = (index: number) => {
    if (index === hiddenIndex && selectedAnswer === null) {
      return "?";
    }
    return progression[index];
  };

  // Get styling for chord display
  const getChordStyle = (index: number) => {
    const baseStyle = "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg transition-all";
    
    if (currentChordIndex === index) {
      return `${baseStyle} bg-primary text-primary-content scale-110`;
    }
    
    if (index === hiddenIndex) {
      if (selectedAnswer === null) {
        return `${baseStyle} bg-warning text-warning-content`;
      }
      if (isCorrect) {
        return `${baseStyle} bg-success text-success-content`;
      }
      return `${baseStyle} bg-error text-error-content`;
    }
    
    return `${baseStyle} bg-base-200`;
  };

  // Get styling for answer buttons
  const getAnswerButtonStyle = (answer: ChordKey) => {
    const baseStyle = "btn w-14 h-14 sm:w-16 sm:h-16 text-lg font-bold";
    
    if (selectedAnswer === null) {
      return `${baseStyle} btn-outline`;
    }
    
    if (answer === progression[hiddenIndex]) {
      return `${baseStyle} btn-success`;
    }
    
    if (answer === selectedAnswer && !isCorrect) {
      return `${baseStyle} btn-error`;
    }
    
    return `${baseStyle} btn-outline opacity-50`;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Chord Progression Trainer</h1>
        <p className="text-sm text-base-content/70">
          Listen to the progression and identify the missing chord
        </p>
      </div>

      {!hasStarted ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-base-content/70 mb-4">
            Test your ear! A 4-chord progression will play, and you'll need to identify
            the chord marked with "?".
          </p>
          <button className="btn btn-primary btn-lg" onClick={generateNewQuestion}>
            Start Training
          </button>
        </div>
      ) : (
        <>
          {/* Chord progression display */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body items-center">
              <h2 className="card-title text-sm mb-4">Chord Progression</h2>
              <div className="flex gap-2 sm:gap-4 justify-center">
                {progression.map((_, index) => (
                  <div key={index} className={getChordStyle(index)}>
                    {getChordDisplay(index)}
                  </div>
                ))}
              </div>
              <button
                className={`btn btn-primary mt-6 ${isPlaying ? "loading" : ""}`}
                onClick={playProgression}
                disabled={isPlaying}
              >
                {isPlaying ? "Playing..." : "Play Progression"}
              </button>
            </div>
          </div>

          {/* Answer options */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <h2 className="text-sm font-semibold">What's the missing chord?</h2>
            <div className="flex gap-2 sm:gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  className={getAnswerButtonStyle(option)}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Result message */}
          {selectedAnswer !== null && (
            <div className={`alert ${isCorrect ? "alert-success" : "alert-error"} mb-6`}>
              <span>
                {isCorrect
                  ? "Correct! Great ear!"
                  : `Not quite. The answer was ${progression[hiddenIndex]}.`}
              </span>
            </div>
          )}

          {/* Next question button */}
          {selectedAnswer !== null && (
            <div className="flex justify-center">
              <button className="btn btn-primary" onClick={generateNewQuestion}>
                Next Question
              </button>
            </div>
          )}
        </>
      )}

      {/* Embed Button - hidden in embed mode */}
      {!isEmbed && (
        <div className="flex justify-center mt-6">
          <EmbedButton
            embedPath="/embed/chord-trainer"
            canonicalPath="/chord-progression-trainer"
            height={560}
            toolName="Chord Trainer"
          />
        </div>
      )}

      {/* Chord reference and FAQ - hidden in embed mode */}
      {!isEmbed && (
        <>
          <div className="divider my-8" />
          <div className="text-sm text-base-content/70">
            <h3 className="font-semibold mb-2">Chord Reference (Key of C):</h3>
            <ul className="grid grid-cols-2 gap-1">
              <li><span className="font-mono">I</span> - C major</li>
              <li><span className="font-mono">ii</span> - D minor</li>
              <li><span className="font-mono">iii</span> - E minor</li>
              <li><span className="font-mono">IV</span> - F major</li>
              <li><span className="font-mono">V</span> - G major</li>
              <li><span className="font-mono">vi</span> - A minor</li>
            </ul>
          </div>

          <div className="divider my-8" />
          <QandA items={FAQ_ITEMS} />
        </>
      )}
    </div>
  );
};

export default ChordProgressionTrainer;
