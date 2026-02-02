This is a Cursor-friendly plan to ship embeddable iframes in a React/Vite app, with the fewest moving parts and a clean path to iterate.

## Goal

Music Teachers can paste an `<iframe>` into their site, your tool renders nicely in a fixed-height box, and it includes a **“Powered by Tempotick”** backlink.

---

## Phase 0: Quick decisions (pick these defaults)

1. **Use dedicated embed routes**: `/embed/metronome`, `/embed/speed-trainer`, etc.
   (Cleaner than `?embed=1`, easier to noindex + header rules.)
2. **Fixed heights first** (no auto-resize yet).
3. **Config via query params** (presets): `?bpm=90&inc=2&bars=4...`

---

## Phase 1: Add embed routes + layout (core plumbing) - DONE

### 1. Create an `EmbedLayout`

**Files**

* `src/layouts/EmbedLayout.tsx` (or `.jsx`)
* `src/layouts/embed.css` (optional)

**Responsibilities**

* No site nav/footer.
* Tight padding, responsive width.
* Attribution link at bottom (opens in new tab).
* Optional: a tiny “Open full tool” button.

```tsx
// src/layouts/EmbedLayout.tsx
import React from "react";

type Props = {
  toolName: string;
  canonicalUrl: string; // full tool page (non-embed)
  children: React.ReactNode;
};

export function EmbedLayout({ toolName, canonicalUrl, children }: Props) {
  return (
    <div style={{ padding: 12, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ borderRadius: 12, overflow: "hidden" }}>
        {children}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
        <a href={canonicalUrl} target="_blank" rel="noreferrer">
          Powered by Tempotick
        </a>
        <span style={{ marginLeft: 8 }}>•</span>
        <a href={canonicalUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>
          Open full {toolName}
        </a>
      </div>
    </div>
  );
}
```

### 2. Add embed routes in React Router

**Files**

* `src/router.tsx` (or wherever your routes live)

Add routes like:

* `/embed/metronome`
* `/embed/speed-trainer`
* `/embed/youtube-looper`
* `/embed/chord-trainer`

Each route renders the existing tool component inside `EmbedLayout`.

```tsx
<Route
  path="/embed/speed-trainer"
  element={
    <EmbedLayout
      toolName="Speed Trainer"
      canonicalUrl="https://www.tempotick.com/speed-trainer-metronome?utm_source=embed&utm_medium=iframe"
    >
      <SpeedTrainer />
    </EmbedLayout>
  }
/>
```

---

## Phase 2: Presets via query params (shareable practice links) - DONE

### 3. Parse query params into tool defaults

**Approach**

* Add a small helper: `src/utils/query.ts`
* In each embed page, read query params and pass as `initialSettings` props into your tool, or set initial state.

```ts
// src/utils/query.ts
export function getNumberParam(sp: URLSearchParams, key: string, fallback: number) {
  const raw = sp.get(key);
  if (!raw) return fallback;
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}
```

Example in Speed Trainer wrapper:

```tsx
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getNumberParam } from "../utils/query";

function useSearchParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function EmbedSpeedTrainerPage() {
  const sp = useSearchParams();

  const initial = {
    startBpm: getNumberParam(sp, "start", 60),
    targetBpm: getNumberParam(sp, "target", 120),
    increment: getNumberParam(sp, "inc", 2),
    barsPerStep: getNumberParam(sp, "bars", 4),
  };

  return (
    <EmbedLayout
      toolName="Speed Trainer"
      canonicalUrl="https://www.tempotick.com/speed-trainer-metronome?utm_source=embed&utm_medium=iframe"
    >
      <SpeedTrainer initialSettings={initial} />
    </EmbedLayout>
  );
}
```

(If your components don’t accept `initialSettings`, add it. This is worth it.)

---

## Phase 3: “Embed” button on the main tool pages (copy-paste UX) - DONE
 
### 4. Add an “Embed” modal with copy button

**Files**

* `src/components/EmbedButton.tsx`
* `src/components/Modal.tsx` (if you don’t have one)

Button should:

* Generate the embed URL using current settings
* Output the iframe snippet with a recommended height
* Copy to clipboard

```tsx
function buildIframe(src: string, height: number) {
  return `<iframe
  src="${src}"
  width="100%"
  height="${height}"
  style="border:0;border-radius:12px;overflow:hidden"
  loading="lazy"
  allow="autoplay"
></iframe>`;
}
```

Recommended default heights (tune later):

* Metronome: `360`
* Speed trainer: `520`
* YouTube looper: `640`
* Chord trainer: `560`

---

## Phase 4: Make sure embedding is allowed (headers)

This is the part that can silently ruin your day if set wrong.

### 5. Remove/avoid frame-blocking headers

Ensure you are **not** sending:

* `X-Frame-Options: DENY`
* `X-Frame-Options: SAMEORIGIN`

### 6. Set a CSP that permits framing

Add:

* `Content-Security-Policy: frame-ancestors *;`

If you want to be slightly safer, you can start with `*` and later lock to known domains if you ever need to.

**How to apply depends on hosting**, so implement the right one:

#### Netlify (`netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "frame-ancestors *;"
```

#### Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "frame-ancestors *;" }
      ]
    }
  ]
}
```

#### Cloudflare Pages

Use `_headers` file:

```
/*
  Content-Security-Policy: frame-ancestors *;
```

(If you’re on something else, you’ll set the equivalent in Nginx/Apache.)

---

## Phase 5: SEO hygiene (don’t index embed pages)

### 7. Noindex embed routes

Simplest in an SPA: use `react-helmet-async`.

**Files**

* `src/main.tsx`: add `HelmetProvider`
* In embed pages: set `<meta name="robots" content="noindex" />`
* Also set canonical to the non-embed page.

```tsx
import { Helmet } from "react-helmet-async";

<Helmet>
  <meta name="robots" content="noindex" />
  <link rel="canonical" href="https://www.tempotick.com/speed-trainer-metronome" />
</Helmet>
```

This prevents `/embed/...` from competing with your main pages.

---

## Phase 6: QA checklist (fast but important)

### 8. Local embed smoke test

Create a throwaway HTML file locally:

```html
<!doctype html>
<html>
  <body style="max-width:900px;margin:40px auto;">
    <iframe src="http://localhost:5173/embed/metronome?bpm=92" width="100%" height="360" style="border:0"></iframe>
  </body>
</html>
```

### 9. Production verification

* Open any `/embed/...` URL directly
* Confirm it renders without nav clutter
* Confirm attribution links out correctly
* Confirm it loads inside another page (no console “refused to frame” errors)

---

## Optional upgrades (later, not now)

1. **Auto-resize iframe height** (postMessage + small parent script). Great, but not needed to launch.
2. **“Embed presets gallery”** (teacher-friendly preset packs).
3. **UTM tracking** on attribution link + embed URL parameters so you can measure which embeds drive traffic.

---

## Cursor execution flow (what to ask it to do)

Use this as your Cursor task list (commit-sized chunks):

1. **Create EmbedLayout + embed routes for 1 tool** (Speed Trainer first)
2. **Add query param parsing + initialSettings plumbing** for that tool
3. **Add Embed button + modal** on the main Speed Trainer page
4. **Repeat for other tools** (metronome, looper, chord trainer)
5. **Add Helmet noindex/canonical** on embed routes
6. **Add CSP frame-ancestors header config** for your hosting


