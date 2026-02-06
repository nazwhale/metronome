import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Metronomi from "./Metronomi";
import { ALLOWED_BPM_VALUES } from "../BpmMetronomePage";
import { BASE_URL, getBpmPageCopy } from "../../i18n/translations";

const ALLOWED_SET = new Set(ALLOWED_BPM_VALUES);

function isValidBpmParam(param: string | undefined): param is string {
  if (!param) return false;
  const n = parseInt(param, 10);
  return Number.isFinite(n) && ALLOWED_SET.has(n as (typeof ALLOWED_BPM_VALUES)[number]);
}

export default function BpmMetronomiPage() {
  const { bpm: bpmParam } = useParams<"bpm">();
  const navigate = useNavigate();

  const bpm = useMemo(() => {
    if (!isValidBpmParam(bpmParam)) {
      navigate("/fi/metronomi", { replace: true });
      return null;
    }
    return parseInt(bpmParam, 10);
  }, [bpmParam, navigate]);

  if (bpm == null) return null;

  const path = `/fi/metronomi/${bpm}-bpm`;
  const hreflangUrls = {
    en: `${BASE_URL}/online-metronome/${bpm}-bpm`,
    es: `${BASE_URL}/es/metronomo/${bpm}-bpm`,
    fi: `${BASE_URL}/fi/metronomi/${bpm}-bpm`,
    xDefault: `${BASE_URL}/online-metronome/${bpm}-bpm`,
  };

  const { title: pageTitle, subheading: pageSubheading } = getBpmPageCopy(
    "fi",
    bpm
  );

  return (
    <Metronomi
      initialBpm={bpm}
      canonicalPathOverride={path}
      seoTitle={`Metronomi ${bpm} BPM - Ilmainen Netissä | tempotick`}
      seoDescription={`Ilmainen metronomi ${bpm} BPM:ssä. Tap tempo, tahtilaji, ei mainoksia. Harjoittele tasaisella ${bpm} iskulla minuutissa.`}
      hreflangUrls={hreflangUrls}
      pageTitle={pageTitle}
      pageSubheading={pageSubheading}
    />
  );
}
