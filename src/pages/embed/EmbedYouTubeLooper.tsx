import { Helmet } from "react-helmet-async";
import { EmbedLayout } from "../../layouts/EmbedLayout";
import YouTubeLooper from "../../YouTubeLooper";

const BASE_URL = "https://www.tempotick.com";
const CANONICAL_URL = `${BASE_URL}/youtube-looper`;

export default function EmbedYouTubeLooper() {
  // YouTubeLooper already handles its own query params (v, start, end)
  // via useSearchParams internally, so we just wrap it
  
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <EmbedLayout
        toolName="YouTube Looper"
        canonicalUrl={`${CANONICAL_URL}?utm_source=embed&utm_medium=iframe`}
      >
        <YouTubeLooper />
      </EmbedLayout>
    </>
  );
}
