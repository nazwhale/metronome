import StandardMetronome from "./Metronomes/Standard.tsx";
import CircleOfFifthsMetronome from "./Metronomes/CircleOfFifths.tsx";
import SpeedTrainerMetronome from "./Metronomes/SpeedTrainer.tsx";
import Blog from "./Blog";
import RandomPromptGenerator from "./RandomPromptGenerator/index.tsx";
import YouTubeLooper from "./YouTubeLooper/index.tsx";
import ChordProgressionTrainer from "./ChordProgressionTrainer/index.tsx";
import MelodicDictationTrainer from "./MelodicDictationTrainer/index.tsx";
import GuitarTriadTrainer from "./GuitarTriadTrainer/index.tsx";
import TimeSignatureExamples from "./TimeSignatureExamples";

const All = [
  {
    path: "/online-metronome",
    component: StandardMetronome,
    name: "basic metronome",
  },
  {
    path: "/circle-of-fifths-metronome",
    component: CircleOfFifthsMetronome,
    name: "circle of fifths metronome",
  },
  {
    path: "/speed-trainer-metronome",
    component: SpeedTrainerMetronome,
    name: "speed trainer metronome",
  },
  {
    path: "/prompts-for-guitar",
    component: RandomPromptGenerator,
    name: "prompts for guitarists",
  },
  {
    path: "/youtube-looper",
    component: YouTubeLooper,
    name: "youtube looper",
  },
  {
    path: "/chord-progression-trainer",
    component: ChordProgressionTrainer,
    name: "chord progression trainer",
  },
  {
    path: "/melodic-dictation-trainer",
    component: MelodicDictationTrainer,
    name: "melodic dictation trainer",
  },
  {
    path: "/guitar-triad-trainer",
    component: GuitarTriadTrainer,
    name: "guitar triad trainer",
  },
  {
    path: "/articles",
    component: Blog,
    name: "articles",
  },
  {
    path: "/time-signature-examples",
    component: TimeSignatureExamples,
    name: "time signature examples",
  },
];

export default All;
