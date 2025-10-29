import StandardMetronome from "./Metronomes/Standard.tsx";
import CircleOfFifthsMetronome from "./Metronomes/CircleOfFifths.tsx";
import SpeedTrainerMetronome from "./Metronomes/SpeedTrainer.tsx";
import Blog from "./Blog";
import RandomPromptGenerator from "./RandomPromptGenerator/index.tsx";

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
    path: "/articles",
    component: Blog,
    name: "articles",
  },
];

export default All;
