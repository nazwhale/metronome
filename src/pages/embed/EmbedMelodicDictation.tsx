import { Helmet } from "react-helmet-async";
import { EmbedLayout } from "../../layouts/EmbedLayout";
import MelodicDictationTrainer from "../../MelodicDictationTrainer";

const BASE_URL = "https://www.tempotick.com";
const CANONICAL_URL = `${BASE_URL}/melodic-dictation-trainer`;

export default function EmbedMelodicDictation() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <EmbedLayout
        toolName="Melodic Dictation Trainer"
        canonicalUrl={`${CANONICAL_URL}?utm_source=embed&utm_medium=iframe`}
      >
        <MelodicDictationTrainer />
      </EmbedLayout>
    </>
  );
}
