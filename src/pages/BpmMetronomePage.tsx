import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StandardMetronome from "../Metronomes/Standard";
import { BASE_URL, getBpmPageCopy } from "../i18n/translations";

/** BPM values from "People also search for" (Google) – used for SEO routes */
export const ALLOWED_BPM_VALUES = [80, 90, 100, 110, 120] as const;

const ALLOWED_SET = new Set(ALLOWED_BPM_VALUES);

function isValidBpmParam(param: string | undefined): param is string {
  if (!param) return false;
  const n = parseInt(param, 10);
  return Number.isFinite(n) && ALLOWED_SET.has(n as (typeof ALLOWED_BPM_VALUES)[number]);
}

export default function BpmMetronomePage() {
  const { bpm: bpmParam } = useParams<"bpm">();
  const navigate = useNavigate();

  const bpm = useMemo(() => {
    if (!isValidBpmParam(bpmParam)) {
      navigate("/online-metronome", { replace: true });
      return null;
    }
    return parseInt(bpmParam, 10);
  }, [bpmParam, navigate]);

  if (bpm == null) return null;

  const path = `/online-metronome/${bpm}-bpm`;
  const hreflangUrls = {
    en: `${BASE_URL}/online-metronome/${bpm}-bpm`,
    es: `${BASE_URL}/es/metronomo/${bpm}-bpm`,
    fi: `${BASE_URL}/fi/metronomi/${bpm}-bpm`,
    xDefault: `${BASE_URL}/online-metronome/${bpm}-bpm`,
  };

  const { title: pageTitle, subheading: pageSubheading } = getBpmPageCopy(
    "en",
    bpm
  );

  return (
    <StandardMetronome
      initialBpm={bpm}
      canonicalPathOverride={path}
      seoTitle={`Metronome ${bpm} BPM - Free Online | tempotick`}
      seoDescription={`Free online metronome at ${bpm} BPM. Tap tempo, time signatures, no ads. Practice with a steady ${bpm} beats per minute click.`}
      hreflangUrls={hreflangUrls}
      pageTitle={pageTitle}
      pageSubheading={pageSubheading}
    />
  );
}
