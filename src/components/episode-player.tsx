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

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8v4h3l4 3V5L6 8H3z" />
      {muted ? (
        <path d="M13.5 8l4 4M17.5 8l-4 4" />
      ) : (
        <>
          <path d="M13 7.5a4 4 0 0 1 0 5" />
          <path d="M15.5 5.5a7 7 0 0 1 0 9" />
        </>
      )}
    </svg>
  );
}

export function EpisodePlayer({ audioSrc }: { audioSrc: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const playedCount = duration > 0 ? Math.round((currentTime / duration) * BAR_COUNT) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

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
      <div className="hidden flex-none items-center gap-2 nav:flex">
        <button
          type="button"
          aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
          onClick={() => setMuted((m) => !m)}
          className="flex-none border-0 bg-transparent p-0 text-ink-soft hover:text-red"
        >
          <SpeakerIcon muted={muted || volume === 0} />
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const next = Number(e.target.value);
            setVolume(next);
            setMuted(next === 0);
          }}
          aria-label="Volume"
          className="h-1 w-[70px] flex-none accent-red"
        />
      </div>
    </div>
  );
}
