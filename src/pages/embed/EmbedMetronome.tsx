import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EmbedLayout } from "../../layouts/EmbedLayout";
import StandardMetronome from "../../Metronomes/Standard";
import { getNumberParam } from "../../utils/query";

const BASE_URL = "https://www.tempotick.com";
const CANONICAL_URL = `${BASE_URL}/online-metronome`;

type TimeSignature = 3 | 4 | 5;

export default function EmbedMetronome() {
  const [searchParams] = useSearchParams();

  // Parse query params with validation
  // ?bpm=120&ts=4
  const initialBpm = getNumberParam(searchParams, "bpm", 120, 20, 300);
  const tsParam = getNumberParam(searchParams, "ts", 4, 3, 5);
  const initialTimeSignature = [3, 4, 5].includes(tsParam) 
    ? (tsParam as TimeSignature) 
    : 4;

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <EmbedLayout
        toolName="Metronome"
        canonicalUrl={`${CANONICAL_URL}?utm_source=embed&utm_medium=iframe`}
      >
        <StandardMetronome 
          initialBpm={initialBpm}
          initialTimeSignature={initialTimeSignature}
        />
      </EmbedLayout>
    </>
  );
}
