import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// YouTube IFrame API types
interface YTPlayer {
  destroy: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
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
  new (element: HTMLElement, options: YTPlayerOptions): YTPlayer;
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
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  startValue,
  endValue,
  currentTime,
  onStartChange,
  onEndChange,
}) => {
  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

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
      <div className="relative h-8 flex items-center">
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

const YouTubeLooper: React.FC = () => {
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

  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const loopIntervalRef = useRef<number | null>(null);
  const pendingLoopParams = useRef<{ start: number; end: number } | null>(null);

  // Load from URL params on mount
  useEffect(() => {
    if (initialLoadDone) return;
    
    const vParam = searchParams.get("v");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

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
    setInitialLoadDone(true);
  }, [searchParams, initialLoadDone]);

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
  };

  const handleJumpToStart = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(loopStart, true);
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

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">YouTube Looper</h1>
      <p className="text-base-content/70 text-center">
        Enter a YouTube URL to watch and loop a section of a video while you practice.
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
            />

            {loopEnabled && (
              <div className="text-sm text-success text-center">
                Looping: {formatTime(loopStart)} → {formatTime(loopEnd)}
              </div>
            )}
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
    </div>
  );
};

export default YouTubeLooper;
