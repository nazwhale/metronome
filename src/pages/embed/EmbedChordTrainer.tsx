import { Helmet } from "react-helmet-async";
import { EmbedLayout } from "../../layouts/EmbedLayout";
import ChordProgressionTrainer from "../../ChordProgressionTrainer";

const BASE_URL = "https://www.tempotick.com";
const CANONICAL_URL = `${BASE_URL}/chord-progression-trainer`;

export default function EmbedChordTrainer() {
  // ChordProgressionTrainer is a quiz with random progressions,
  // so no query params needed
  
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <EmbedLayout
        toolName="Chord Trainer"
        canonicalUrl={`${CANONICAL_URL}?utm_source=embed&utm_medium=iframe`}
      >
        <ChordProgressionTrainer />
      </EmbedLayout>
    </>
  );
}
