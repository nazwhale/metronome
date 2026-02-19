import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import pako from "pako";
import QandA, { QAItem } from "../components/QandA";
import { useIsEmbed } from "../contexts/EmbedContext";
import { EmbedButton } from "../components/EmbedModal";

const FAQ_ITEMS: QAItem[] = [
  {
    question: "How to use this YouTube video looper",
    answer: (
      <div>
        <p className="mb-2">Using this YouTube looper is simple:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Paste any YouTube URL into the input field and click "Load Video"</li>
          <li>Once the video loads, use the two slider handles to set your loop start and end points</li>
          <li>The video will automatically loop between these points while "Enable" is toggled on</li>
          <li>Use "Jump to Start" to restart from your loop point, or "Copy Link" to share your loop with others</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is this looper useful for?",
    answer: (
      <div>
        <p className="mb-2">This YouTube looper is especially useful for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Musicians</strong> – Loop a guitar solo, bass line, or drum fill to learn it by ear</li>
          <li><strong>Language learners</strong> – Repeat a phrase or dialogue until you understand it</li>
          <li><strong>Dancers</strong> – Practice choreography by looping specific sections</li>
          <li><strong>Students</strong> – Review key parts of educational videos</li>
          <li><strong>Transcribers</strong> – Loop difficult passages while writing out music or lyrics</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How to repeat YouTube videos on computer",
    answer: (
      <p>
        While YouTube has a built-in loop feature (right-click the video and select "Loop"), it only loops the
        entire video. To loop a specific section, you need a tool like this YouTube looper. Simply paste the
        video URL, set your start and end points using the sliders, and the video will continuously repeat
        that section. This is much more useful for practice and learning than looping the whole video.
      </p>
    ),
  },
  {
    question: "Can a YouTube video be set to loop?",
    answer: (
      <p>
        Yes! On YouTube directly, you can right-click any video and select "Loop" to make it repeat endlessly.
        However, this loops the entire video from start to finish. If you want to loop just a portion of a
        video—like a specific chorus, solo, or tutorial segment—you'll need to use a looper tool like this
        one, which lets you define custom start and end points for your loop.
      </p>
    ),
  },
  {
    question: "Can I loop a YouTube video forever?",
    answer: (
      <p>
        Yes, both YouTube's native loop and this looper tool will repeat indefinitely until you stop them.
        With this tool, you can loop a specific section forever—perfect for background music, meditation
        sounds, practice sessions, or any situation where you want continuous playback of a particular
        segment. Just set your loop points and leave it playing.
      </p>
    ),
  },
  {
    question: "How to make YouTube play continuously?",
    answer: (
      <p>
        For continuous playback of a single video, right-click and enable "Loop" on YouTube. For continuous
        playback of a specific section, use this looper tool to set custom start and end points. For
        continuous playback of multiple videos, create a YouTube playlist and enable playlist looping.
        This looper is ideal when you need precise control over which part of a video plays on repeat.
      </p>
    ),
  },
  {
    question: "Why am I not able to loop videos on YouTube?",
    answer: (
      <div>
        <p className="mb-2">If you're having trouble looping on YouTube, here are common causes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Mobile app limitations</strong> – The loop feature may not appear on all mobile versions; try using the desktop site</li>
          <li><strong>Embedded videos</strong> – Right-click loop may not work on embedded players; open the video on YouTube directly</li>
          <li><strong>Browser extensions</strong> – Some ad blockers or extensions can interfere with YouTube features</li>
          <li><strong>Need section looping</strong> – YouTube's native loop only works for full videos; use this tool for section looping</li>
        </ul>
      </div>
    ),
  },
];

// YouTube IFrame API types
interface YTVideoData {
  title: string;
  video_id: string;
  author: string;
}

interface YTPlayer {
  destroy: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  getPlaybackRate: () => number;
  setPlaybackRate: (suggestedRate: number) => void;
  getAvailablePlaybackRates: () => number[];
  getVideoData: () => YTVideoData;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

interface YTOnStateChangeEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    autoplay?: number;
    modestbranding?: number;
    rel?: number;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTOnStateChangeEvent) => void;
  };
}

interface YTPlayerConstructor {
  new(element: HTMLElement, options: YTPlayerOptions): YTPlayer;
}

interface YTNamespace {
  Player: YTPlayerConstructor;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Folder and saved loop types
interface SavedLoopFolder {
  id: string;
  name: string;
  createdAt: number;
}

interface SavedLoop {
  id: string;
  name: string;
  videoId: string;
  start: number;
  end: number;
  playbackRate: number;
  createdAt: number;
  folderId: string | null;
}

interface SavedLoopsData {
  version: 2;
  folders: SavedLoopFolder[];
  loops: SavedLoop[];
}

const SAVED_LOOPS_KEY = "youtube-looper-saved-loops";
const UNCATEGORIZED = "__uncategorized__";

function isLegacyLoops(data: unknown): data is SavedLoop[] {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return true;
  const first = data[0];
  return first != null && typeof first === "object" && "id" in first && "videoId" in first && !("folderId" in first);
}

const loadSavedLoopsData = (): { folders: SavedLoopFolder[]; loops: SavedLoop[] } => {
  try {
    const stored = localStorage.getItem(SAVED_LOOPS_KEY);
    if (!stored) return { folders: [], loops: [] };

    const data: unknown = JSON.parse(stored);

    // Legacy: flat array of loops
    if (isLegacyLoops(data)) {
      const loops: SavedLoop[] = data.map((loop) => ({
        ...loop,
        folderId: null,
      }));
      return { folders: [], loops };
    }

    const typed = data as SavedLoopsData;
    if (typed.version === 2 && Array.isArray(typed.folders) && Array.isArray(typed.loops)) {
      return { folders: typed.folders, loops: typed.loops };
    }

    return { folders: [], loops: [] };
  } catch {
    return { folders: [], loops: [] };
  }
};

const saveSavedLoopsData = (folders: SavedLoopFolder[], loops: SavedLoop[]) => {
  try {
    const data: SavedLoopsData = { version: 2, folders, loops };
    localStorage.setItem(SAVED_LOOPS_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
};

// Shareable folder payload (no ids or timestamps)
interface SharedLoop {
  videoId: string;
  name: string;
  start: number;
  end: number;
  playbackRate: number;
}

interface SharedFolderPayload {
  folderName: string;
  loops: SharedLoop[];
}

const MAX_SHARE_LOOPS = 30;
const SHARE_PARAM = "share";

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeSharedFolder(folderName: string, loops: SharedLoop[]): string | null {
  if (loops.length === 0 || loops.length > MAX_SHARE_LOOPS) return null;
  try {
    const payload: SharedFolderPayload = { folderName, loops };
    const json = JSON.stringify(payload);
    const compressed = pako.deflate(json);
    return base64UrlEncode(compressed);
  } catch {
    return null;
  }
}

function decodeSharedFolder(encoded: string): SharedFolderPayload | null {
  try {
    const bytes = base64UrlDecode(encoded);
    const json = pako.inflate(bytes, { to: "string" });
    const data: unknown = JSON.parse(json);
    if (!data || typeof data !== "object" || !("folderName" in data) || !("loops" in data)) return null;
    const folderName = (data as { folderName: unknown }).folderName;
    const loops = (data as { loops: unknown }).loops;
    if (typeof folderName !== "string" || !Array.isArray(loops)) return null;
    if (loops.length > MAX_SHARE_LOOPS) return null;
    const out: SharedLoop[] = [];
    for (const item of loops) {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      if (
        typeof o.videoId !== "string" ||
        typeof o.name !== "string" ||
        typeof o.start !== "number" ||
        typeof o.end !== "number" ||
        typeof o.playbackRate !== "number"
      ) {
        return null;
      }
      if (o.videoId.length > 20 || o.name.length > 500) return null;
      out.push({
        videoId: o.videoId,
        name: o.name,
        start: o.start,
        end: o.end,
        playbackRate: o.playbackRate,
      });
    }
    return { folderName, loops: out };
  } catch {
    return null;
  }
}

const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

type RangeSliderProps = {
  min: number;
  max: number;
  startValue: number;
  endValue: number;
  currentTime: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
  onSeek?: (value: number) => void;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  startValue,
  endValue,
  currentTime,
  onStartChange,
  onEndChange,
  onSeek,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !onSeek) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = min + percent * (max - min);
    onSeek(seekTime);
  };

  const startPercent = getPercent(startValue);
  const endPercent = getPercent(endValue);
  const currentPercent = getPercent(Math.min(currentTime, max));

  return (
    <div className="w-full px-2 py-4">
      {/* Time labels */}
      <div className="flex justify-between text-sm text-base-content/70 mb-1">
        <span>{formatTime(startValue)}</span>
        <span className="text-primary font-medium">{formatTime(currentTime)}</span>
        <span>{formatTime(endValue)}</span>
      </div>

      {/* Slider container */}
      <div
        ref={trackRef}
        className="relative h-8 flex items-center cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Track background */}
        <div className="absolute w-full h-2 bg-base-300 rounded-full" />

        {/* Selected range */}
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />

        {/* Current time indicator */}
        <div
          className="absolute w-1 h-4 bg-accent rounded-full -translate-x-1/2 z-10"
          style={{ left: `${currentPercent}%` }}
        />

        {/* Start handle input */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={startValue}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value < endValue - 0.5) {
              onStartChange(value);
            }
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-primary-content
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-primary-content
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:shadow-md"
        />

        {/* End handle input */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={endValue}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value > startValue + 0.5) {
              onEndChange(value);
            }
          }}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-secondary
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-secondary-content
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-secondary
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-secondary-content
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:shadow-md"
        />
      </div>

      {/* Duration label */}
      <div className="flex justify-between text-xs text-base-content/50 mt-1">
        <span>{formatTime(min)}</span>
        <span>{formatTime(max)}</span>
      </div>
    </div>
  );
};

function SavedLoopRow({
  loop,
  folders,
  onLoad,
  onDelete,
  onMove,
  formatTime,
}: {
  loop: SavedLoop;
  folders: SavedLoopFolder[];
  onLoad: (loop: SavedLoop) => void;
  onDelete: (id: string) => void;
  onMove: (loopId: string, folderId: string | null) => void;
  formatTime: (s: number) => string;
}) {
  return (
    <div className="flex items-center justify-between bg-base-100 rounded-lg p-3 gap-2">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{loop.name}</div>
        <div className="text-sm text-base-content/60">
          {formatTime(loop.start)} → {formatTime(loop.end)}
          {loop.playbackRate !== 1 && (
            <span className="ml-2">({Math.round(loop.playbackRate * 100)}% speed)</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <button type="button" onClick={() => onLoad(loop)} className="btn btn-sm btn-primary">
          Load
        </button>
        {folders.length > 0 && (
          <select
            className="select select-sm select-bordered w-32 max-w-[8rem]"
            value={loop.folderId ?? UNCATEGORIZED}
            onChange={(e) => onMove(loop.id, e.target.value === UNCATEGORIZED ? null : e.target.value)}
            onClick={(e) => e.stopPropagation()}
            title="Move to folder"
          >
            <option value={UNCATEGORIZED}>No folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={() => onDelete(loop.id)}
          className="btn btn-sm btn-ghost text-error"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const YouTubeLooper: React.FC = () => {
  const isEmbed = useIsEmbed();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set SEO-friendly document title
  useEffect(() => {
    document.title = "YouTube Looper - Loop Any Section of a YouTube Video for Practice";
    return () => {
      document.title = "Metronome";
    };
  }, []);

  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loopStart, setLoopStart] = useState<number>(0);
  const [loopEnd, setLoopEnd] = useState<number>(0);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isApiReady, setIsApiReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [folders, setFolders] = useState<SavedLoopFolder[]>([]);
  const [savedLoops, setSavedLoops] = useState<SavedLoop[]>([]);
  const [loopName, setLoopName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveToFolderId, setSaveToFolderId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [addedFolderToast, setAddedFolderToast] = useState<string | null>(null);
  const [shareCopiedFolderId, setShareCopiedFolderId] = useState<string | null>(null);

  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const loopIntervalRef = useRef<number | null>(null);
  const pendingLoopParams = useRef<{ start: number; end: number } | null>(null);

  // Load saved loops and folders from localStorage on mount
  useEffect(() => {
    const { folders: f, loops: l } = loadSavedLoopsData();
    setFolders(f);
    setSavedLoops(l);
    setExpandedFolderIds(new Set(f.map((x) => x.id)));
  }, []);

  // Load from URL params on mount
  useEffect(() => {
    if (initialLoadDone) return;

    const vParam = searchParams.get("v");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const shareParam = searchParams.get(SHARE_PARAM);

    if (vParam) {
      setVideoId(vParam);
      setUrl(`https://youtube.com/watch?v=${vParam}`);

      if (startParam || endParam) {
        const start = startParam ? parseFloat(startParam) : 0;
        const end = endParam ? parseFloat(endParam) : 0;
        pendingLoopParams.current = { start, end };
        setLoopEnabled(true);
      }
    }

    if (shareParam) {
      const payload = decodeSharedFolder(shareParam);
      const nextParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        if (key !== SHARE_PARAM) nextParams[key] = value;
      });
      setSearchParams(nextParams, { replace: true });

      if (payload) {
        const { folders: f, loops: l } = loadSavedLoopsData();
        const folderId = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        const newFolder: SavedLoopFolder = { id: folderId, name: payload.folderName, createdAt: now };
        const newLoops: SavedLoop[] = payload.loops.map((loop, i) => ({
          id: `loop-${now}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          name: loop.name,
          videoId: loop.videoId,
          start: loop.start,
          end: loop.end,
          playbackRate: loop.playbackRate,
          createdAt: now,
          folderId,
        }));
        const updatedFolders = [...f, newFolder];
        const updatedLoops = [...l, ...newLoops];
        saveSavedLoopsData(updatedFolders, updatedLoops);
        setFolders(updatedFolders);
        setSavedLoops(updatedLoops);
        setExpandedFolderIds((prev) => new Set(prev).add(folderId));
        setAddedFolderToast(`Added shared folder "${payload.folderName}"`);
        setTimeout(() => setAddedFolderToast(null), 3000);
      } else {
        setShareError("Invalid or expired share link");
      }
    }

    setInitialLoadDone(true);
  }, [searchParams, initialLoadDone, setSearchParams]);

  // Update URL params when state changes
  const updateUrlParams = useCallback((vid: string | null, start: number, end: number, dur: number) => {
    if (!vid) {
      setSearchParams({}, { replace: true });
      return;
    }

    const params: Record<string, string> = { v: vid };

    // Only include start/end if they differ from defaults (0 and duration)
    if (start > 0) {
      params.start = start.toFixed(1);
    }
    if (end > 0 && end < dur) {
      params.end = end.toFixed(1);
    }

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Update URL when video or loop params change
  useEffect(() => {
    if (!initialLoadDone) return;
    updateUrlParams(videoId, loopStart, loopEnd, duration);
  }, [videoId, loopStart, loopEnd, duration, updateUrlParams, initialLoadDone]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };
  }, []);

  // Create/update player when videoId changes
  useEffect(() => {
    if (!isApiReady || !videoId || !playerContainerRef.current) return;

    // Destroy existing player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: YTPlayerEvent) => {
          const dur = event.target.getDuration();
          setDuration(dur);

          // Get video title
          try {
            const videoData = event.target.getVideoData();
            if (videoData?.title) {
              setVideoTitle(videoData.title);
            }
          } catch {
            // getVideoData might not be available in some cases
          }

          // Apply pending loop params from URL
          if (pendingLoopParams.current) {
            const { start, end } = pendingLoopParams.current;
            setLoopStart(start);
            setLoopEnd(end > 0 ? end : dur);
            event.target.seekTo(start, true);
            pendingLoopParams.current = null;
          } else {
            setLoopEnd(dur);
          }
        },
        onStateChange: (event: YTOnStateChangeEvent) => {
          // When video ends, restart from loop start if looping whole video
          if (event.data === window.YT.PlayerState.ENDED && !loopEnabled) {
            event.target.seekTo(0, true);
            event.target.playVideo();
          }
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isApiReady, videoId]);

  // Loop checking interval
  useEffect(() => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
    }

    if (!playerRef.current || !loopEnabled) return;

    loopIntervalRef.current = window.setInterval(() => {
      if (!playerRef.current) return;

      try {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        if (time >= loopEnd || time < loopStart - 0.5) {
          playerRef.current.seekTo(loopStart, true);
        }
      } catch {
        // Player might not be ready
      }
    }, 100);

    return () => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
      }
    };
  }, [loopEnabled, loopStart, loopEnd]);

  // Update current time display even when not looping
  useEffect(() => {
    if (loopEnabled) return; // Already handled by loop interval

    const interval = window.setInterval(() => {
      if (!playerRef.current) return;
      try {
        setCurrentTime(playerRef.current.getCurrentTime());
      } catch {
        // Player might not be ready
      }
    }, 250);

    return () => clearInterval(interval);
  }, [loopEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      setError(null);
      setLoopStart(0);
      setLoopEnd(0);
      setLoopEnabled(true);
      setPlaybackRate(1);
      setVideoTitle("");
      pendingLoopParams.current = null;
    } else {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link.");
      setVideoId(null);
    }
  };

  const handleClear = () => {
    setUrl("");
    setVideoId(null);
    setError(null);
    setLoopStart(0);
    setLoopEnd(0);
    setLoopEnabled(false);
    setDuration(0);
    setPlaybackRate(1);
    setVideoTitle("");
  };

  const handleJumpToStart = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(loopStart, true);
    }
  };

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeedChange = (delta: number) => {
    if (!playerRef.current) return;

    // Calculate new rate based on percentage change
    const newRate = Math.max(0.25, Math.min(2, playbackRate + delta));

    // Round to nearest 0.05 for cleaner display
    const roundedRate = Math.round(newRate * 20) / 20;

    playerRef.current.setPlaybackRate(roundedRate);
    setPlaybackRate(roundedRate);
  };

  const handleResetSpeed = () => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackRate(1);
    setPlaybackRate(1);
  };

  const handleSaveLoop = () => {
    if (!videoId) return;

    // Default name: video title with time range, or just time range if no title
    const timeRange = `${formatTime(loopStart)} - ${formatTime(loopEnd)}`;
    const defaultName = videoTitle
      ? `${videoTitle} (${timeRange})`
      : `Loop ${timeRange}`;

    const newLoop: SavedLoop = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: loopName.trim() || defaultName,
      videoId,
      start: loopStart,
      end: loopEnd,
      playbackRate,
      createdAt: Date.now(),
      folderId: saveToFolderId,
    };

    const updatedLoops = [newLoop, ...savedLoops];
    setSavedLoops(updatedLoops);
    saveSavedLoopsData(folders, updatedLoops);
    setLoopName("");
    setShowSaveInput(false);
  };

  const handleLoadLoop = (loop: SavedLoop) => {
    setVideoId(loop.videoId);
    setUrl(`https://youtube.com/watch?v=${loop.videoId}`);
    pendingLoopParams.current = { start: loop.start, end: loop.end };
    setLoopEnabled(true);
    setPlaybackRate(loop.playbackRate);

    // If player already exists with same video, apply settings immediately
    if (playerRef.current && videoId === loop.videoId) {
      setLoopStart(loop.start);
      setLoopEnd(loop.end);
      playerRef.current.seekTo(loop.start, true);
      playerRef.current.setPlaybackRate(loop.playbackRate);
    }
  };

  const handleDeleteLoop = (loopId: string) => {
    const updatedLoops = savedLoops.filter((loop) => loop.id !== loopId);
    setSavedLoops(updatedLoops);
    saveSavedLoopsData(folders, updatedLoops);
  };

  const handleMoveLoop = (loopId: string, folderId: string | null) => {
    const updatedLoops = savedLoops.map((l) => (l.id === loopId ? { ...l, folderId } : l));
    setSavedLoops(updatedLoops);
    saveSavedLoopsData(folders, updatedLoops);
  };

  const createFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFolder: SavedLoopFolder = { id, name, createdAt: Date.now() };
    const updated = [...folders, newFolder].sort((a, b) => a.createdAt - b.createdAt);
    setFolders(updated);
    saveSavedLoopsData(updated, savedLoops);
    setNewFolderName("");
    setShowNewFolderInput(false);
    setExpandedFolderIds((prev) => new Set(prev).add(id));
  };

  const updateFolderName = (folderId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const updated = folders.map((f) => (f.id === folderId ? { ...f, name: trimmed } : f));
    setFolders(updated);
    saveSavedLoopsData(updated, savedLoops);
    setEditingFolderId(null);
    setEditingFolderName("");
  };

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    const updatedLoops = savedLoops.map((l) => (l.folderId === folderId ? { ...l, folderId: null } : l));
    setFolders(updatedFolders);
    setSavedLoops(updatedLoops);
    saveSavedLoopsData(updatedFolders, updatedLoops);
    setEditingFolderId(null);
  };

  const toggleFolderExpanded = (folderId: string) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleShareFolder = async (folderId: string, folderName: string, loops: SavedLoop[]) => {
    const shared: SharedLoop[] = loops.map((l) => ({
      videoId: l.videoId,
      name: l.name,
      start: l.start,
      end: l.end,
      playbackRate: l.playbackRate,
    }));
    const encoded = encodeSharedFolder(folderName, shared);
    if (!encoded) return;
    if (typeof window === "undefined") return;
    const path = window.location.pathname.includes("/embed/")
      ? window.location.pathname.replace("/embed", "")
      : window.location.pathname;
    const shareUrl = `${window.location.origin}${path}?${SHARE_PARAM}=${encoded}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopiedFolderId(folderId);
      setTimeout(() => setShareCopiedFolderId(null), 2000);
    } catch {
      setShareError("Could not copy link");
    }
  };

  const uncategorizedLoops = savedLoops.filter((l) => l.folderId == null);
  const loopsByFolder = folders.map((f) => ({ folder: f, loops: savedLoops.filter((l) => l.folderId === f.id) }));
  const hasAnyLoops = savedLoops.length > 0 || folders.length > 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">YouTube Looper</h1>
      <p className="text-base-content/70 text-center">
        Enter a{" "}
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          YouTube
        </a>{" "}
        URL to watch and loop a section of a video while you practice.{" "}
        <a
          href="/youtube-looper?v=X791IzOwt3Q&start=355.1"
          className="link link-primary"
        >
          Try one
        </a>
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="input input-bordered flex-1"
        />
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            Load Video
          </button>
          {videoId && (
            <button type="button" onClick={handleClear} className="btn btn-ghost">
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {shareError && (
        <div className="alert alert-warning w-full">
          <span>{shareError}</span>
          <button type="button" onClick={() => setShareError(null)} className="btn btn-sm btn-ghost">
            Dismiss
          </button>
        </div>
      )}

      {addedFolderToast && (
        <div className="alert alert-success w-full">
          <span>{addedFolderToast}</span>
        </div>
      )}

      {videoId && isApiReady ? (
        <>
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <div ref={playerContainerRef} className="w-full h-full" />
          </div>

          {/* Loop Controls */}
          <div className="w-full bg-base-200 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold">Loop Section</h2>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={handleJumpToStart}
                  className="btn btn-sm btn-ghost"
                >
                  Jump to Start
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-sm btn-outline"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Enable</span>
                  <input
                    type="checkbox"
                    checked={loopEnabled}
                    onChange={(e) => setLoopEnabled(e.target.checked)}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
            </div>

            <RangeSlider
              min={0}
              max={duration || 100}
              startValue={loopStart}
              endValue={loopEnd}
              currentTime={currentTime}
              onStartChange={setLoopStart}
              onEndChange={setLoopEnd}
              onSeek={handleSeek}
            />

            {/* Set to Current Time buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setLoopStart(currentTime)}
                className="btn btn-sm btn-outline"
                disabled={currentTime >= loopEnd - 0.5}
              >
                Set Start Here
              </button>
              <button
                type="button"
                onClick={() => setLoopEnd(currentTime)}
                className="btn btn-sm btn-outline"
                disabled={currentTime <= loopStart + 0.5}
              >
                Set End Here
              </button>
            </div>

            {loopEnabled && (
              <div className="text-sm text-success text-center">
                Looping: {formatTime(loopStart)} → {formatTime(loopEnd)}
              </div>
            )}
          </div>

          {/* Speed Controls */}
          <div className="w-full bg-base-200 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-semibold">Playback Speed</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSpeedChange(-0.1)}
                  className="btn btn-sm btn-outline"
                  disabled={playbackRate <= 0.25}
                >
                  -10%
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeedChange(-0.05)}
                  className="btn btn-sm btn-outline"
                  disabled={playbackRate <= 0.25}
                >
                  -5%
                </button>
                <button
                  type="button"
                  onClick={handleResetSpeed}
                  className="btn btn-sm btn-primary min-w-[4.5rem]"
                >
                  {Math.round(playbackRate * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeedChange(0.05)}
                  className="btn btn-sm btn-outline"
                  disabled={playbackRate >= 2}
                >
                  +5%
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeedChange(0.1)}
                  className="btn btn-sm btn-outline"
                  disabled={playbackRate >= 2}
                >
                  +10%
                </button>
              </div>
            </div>
          </div>

          {/* Save Loop */}
          <div className="w-full bg-base-200 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-semibold">Save Loop</h2>
              {!showSaveInput ? (
                <button
                  type="button"
                  onClick={() => setShowSaveInput(true)}
                  className="btn btn-sm btn-outline"
                >
                  Save Current Loop
                </button>
              ) : (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={loopName}
                      onChange={(e) => setLoopName(e.target.value)}
                      placeholder="Loop name (optional)"
                      className="input input-sm input-bordered w-48"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveLoop();
                        if (e.key === "Escape") {
                          setShowSaveInput(false);
                          setLoopName("");
                        }
                      }}
                      autoFocus
                    />
                    {folders.length > 0 && (
                      <select
                        className="select select-sm select-bordered w-40"
                        value={saveToFolderId ?? UNCATEGORIZED}
                        onChange={(e) => setSaveToFolderId(e.target.value === UNCATEGORIZED ? null : e.target.value)}
                      >
                        <option value={UNCATEGORIZED}>No folder</option>
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveLoop}
                      className="btn btn-sm btn-primary"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSaveInput(false);
                        setLoopName("");
                      }}
                      className="btn btn-sm btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        !error && (
          <div className="w-full aspect-video bg-base-200 rounded-lg flex items-center justify-center">
            <p className="text-base-content/50">Your video will appear here</p>
          </div>
        )
      )}

      <div className="text-sm text-base-content/60 text-center">
        <p>Drag the handles to set loop start and end points. Use "Copy Link" to share.</p>
      </div>

      {/* Saved Loops with Folders */}
      {hasAnyLoops && (
        <div className="w-full bg-base-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h2 className="text-lg font-semibold">Saved Loops</h2>
            {!showNewFolderInput ? (
              <button
                type="button"
                onClick={() => setShowNewFolderInput(true)}
                className="btn btn-sm btn-outline"
              >
                New folder
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="input input-sm input-bordered w-40"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createFolder();
                    if (e.key === "Escape") {
                      setShowNewFolderInput(false);
                      setNewFolderName("");
                    }
                  }}
                  autoFocus
                />
                <button type="button" onClick={createFolder} className="btn btn-sm btn-primary">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFolderInput(false);
                    setNewFolderName("");
                  }}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {/* No folder */}
            {uncategorizedLoops.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                  <span>No folder</span>
                  <span className="badge badge-ghost badge-sm">{uncategorizedLoops.length}</span>
                </div>
                <div className="space-y-2 pl-0">
                  {uncategorizedLoops.map((loop) => (
                    <SavedLoopRow
                      key={loop.id}
                      loop={loop}
                      folders={folders}
                      onLoad={handleLoadLoop}
                      onDelete={handleDeleteLoop}
                      onMove={handleMoveLoop}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Folders */}
            {loopsByFolder.map(({ folder, loops }) => {
              const isExpanded = expandedFolderIds.has(folder.id);
              const isEditing = editingFolderId === folder.id;
              return (
                <div key={folder.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFolderExpanded(folder.id)}
                      className="btn btn-ghost btn-sm btn-square p-0 min-h-0 h-6 w-6"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <span className="text-base-content/70">{isExpanded ? "▼" : "▶"}</span>
                    </button>
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          className="input input-sm input-bordered flex-1 max-w-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") updateFolderName(folder.id, editingFolderName);
                            if (e.key === "Escape") {
                              setEditingFolderId(null);
                              setEditingFolderName("");
                            }
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => updateFolderName(folder.id, editingFolderName)}
                          className="btn btn-sm btn-primary"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFolderId(null);
                            setEditingFolderName("");
                          }}
                          className="btn btn-sm btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-base-content/80">{folder.name}</span>
                        <span className="badge badge-ghost badge-sm">{loops.length}</span>
                        {loops.length >= 1 && loops.length <= MAX_SHARE_LOOPS && (
                          <button
                            type="button"
                            onClick={() => handleShareFolder(folder.id, folder.name, loops)}
                            className="btn btn-ghost btn-xs"
                          >
                            {shareCopiedFolderId === folder.id ? "Link copied!" : "Share folder"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFolderId(folder.id);
                            setEditingFolderName(folder.name);
                          }}
                          className="btn btn-ghost btn-xs"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFolder(folder.id)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Delete folder
                        </button>
                      </>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="space-y-2 pl-6 border-l-2 border-base-300 ml-1">
                      {loops.map((loop) => (
                        <SavedLoopRow
                          key={loop.id}
                          loop={loop}
                          folders={folders}
                          onLoad={handleLoadLoop}
                          onDelete={handleDeleteLoop}
                          onMove={handleMoveLoop}
                          formatTime={formatTime}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embed Button - hidden in embed mode */}
      {!isEmbed && videoId && (
        <EmbedButton
          embedPath="/embed/youtube-looper"
          canonicalPath="/youtube-looper"
          queryParams={{
            v: videoId,
            ...(loopStart > 0 && { start: loopStart.toFixed(1) }),
            ...(loopEnd > 0 && loopEnd < duration && { end: loopEnd.toFixed(1) }),
          }}
          height={640}
          toolName="YouTube Looper"
        />
      )}

      {/* FAQ Section - hidden in embed mode */}
      {!isEmbed && (
        <div className="w-full mt-8">
          <div className="divider" />
          <QandA items={FAQ_ITEMS} />
        </div>
      )}
    </div>
  );
};

export default YouTubeLooper;
