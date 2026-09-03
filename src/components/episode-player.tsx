// src/components/episode-player.tsx
"use client";

import { useState } from "react";

const BAR_COUNT = 56;
const PLAYED_COUNT = 14;

function barHeight(i: number) {
  return 20 + Math.round(70 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)));
}

export function EpisodePlayer({ timecode }: { timecode: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex items-center gap-[18px] border border-line bg-cream px-[18px] py-[14px]">
      <button
        type="button"
        aria-label={playing ? "Pause episode" : "Play episode"}
        onClick={() => setPlaying((p) => !p)}
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
              background: i < PLAYED_COUNT ? "#B01F24" : "#DCD1C8",
              animation: playing ? `cr-bar 1.1s ease-in-out ${(i % 9) * 0.09}s infinite` : "none",
            }}
          />
        ))}
      </div>
      <span className="flex-none font-mono text-xs text-muted">{timecode}</span>
    </div>
  );
}
