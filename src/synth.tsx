import * as Tone from "tone";

// Synthesizer for regular beats
export const regularSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0,
    release: 0.1,
  },
}).toDestination();

// Synthesizer for the 4th beat (accent / downbeat)
export const fourthBeatSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0,
    release: 0.2,
  },
}).toDestination();

// Softer click for less emphasised beats (e.g. beats 2, 3, 4 in 4/4)
export const weakBeatSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.005,
    decay: 0.06,
    sustain: 0,
    release: 0.06,
  },
  volume: -8,
}).toDestination();
