import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EmbedLayout } from "../../layouts/EmbedLayout";
import SpeedTrainer from "../../Metronomes/SpeedTrainer";
import { getNumberParam } from "../../utils/query";

const BASE_URL = "https://www.tempotick.com";
const CANONICAL_URL = `${BASE_URL}/speed-trainer-metronome`;

export default function EmbedSpeedTrainer() {
  const [searchParams] = useSearchParams();

  // Parse query params with validation
  // ?start=60&target=120&inc=5&bars=4
  const initialSettings = {
    startBpm: getNumberParam(searchParams, "start", 60, 20, 300),
    targetBpm: getNumberParam(searchParams, "target", 90, 20, 300),
    bpmIncrement: getNumberParam(searchParams, "inc", 5, 1, 50),
    barsBeforeIncrement: getNumberParam(searchParams, "bars", 4, 1, 32),
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <EmbedLayout
        toolName="Speed Trainer"
        canonicalUrl={`${CANONICAL_URL}?utm_source=embed&utm_medium=iframe`}
      >
        <SpeedTrainer initialSettings={initialSettings} />
      </EmbedLayout>
    </>
  );
}
