// src/components/episode-player.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const BAR_COUNT = 56;

function barHeight(i: number) {
  return 20 + Math.round(70 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)));
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function EpisodePlayer({ audioSrc }: { audioSrc: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playedCount = duration > 0 ? Math.round((currentTime / duration) * BAR_COUNT) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // The audio tag starts loading natively as soon as the static HTML parses,
    // which can happen before hydration attaches React's event listeners — so
    // check the already-loaded value directly in addition to listening.
    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    updateDuration();
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
    };
  }, []);

  return (
    <div className="flex items-center gap-[18px] border border-line bg-cream px-[18px] py-[14px]">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <button
        type="button"
        aria-label={playing ? "Pause episode" : "Play episode"}
        onClick={() => (playing ? audioRef.current?.pause() : audioRef.current?.play())}
        className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-0 bg-red text-[15px] text-white hover:bg-red-dark"
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="flex h-[34px] min-w-0 flex-1 items-end gap-[3px] overflow-hidden">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span
            key={i}
            className="block min-w-[2px] flex-1 origin-bottom rounded-[1px]"
            style={{
              height: `${barHeight(i)}%`,
              background: i < playedCount ? "#B01F24" : "#DCD1C8",
              animation: playing ? `cr-bar 1.1s ease-in-out ${(i % 9) * 0.09}s infinite` : "none",
            }}
          />
        ))}
      </div>
      <span className="flex-none font-mono text-xs text-muted">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
