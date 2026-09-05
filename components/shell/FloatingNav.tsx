"use client";

import { useUI } from "@/components/LangContext";
import { Mark, Pause, Play, Search } from "@/components/ui/Icons";
import type { Lang } from "@/lib/i18n";

export function FloatingNav({
  lang,
  onLang,
  playing,
  onPlay,
  onStop,
  onHome,
  onPalette,
  dimmed,
}: {
  lang: Lang;
  onLang: (l: Lang) => void;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
  onHome: () => void;
  onPalette: () => void;
  dimmed: boolean;
}) {
  const ui = useUI();

  return (
    <header
      className="edge-with-narrator fixed inset-x-0 top-0 z-40"
      style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity var(--d-major) var(--ease)" }}
    >
      <div className="mx-auto flex max-w-[1220px] items-center justify-between px-6 py-5 md:px-9">
        <button
          onClick={onHome}
          className="flex items-center gap-2.5 text-fg2 transition-colors duration-150 hover:text-fg"
        >
          <Mark className="h-[18px] w-[18px]" />
          <span className="text-[12.5px] font-medium tracking-[0.24em]">ORBIT</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onPalette}
            className="hidden items-center gap-2 rounded-sm2 border border-line px-2.5 py-1.5 text-[11.5px] text-fg3 transition-colors duration-150 hover:border-lineStrong hover:text-fg2 sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            {ui.common.search}
            <span className="ml-1 text-fg4">⌘K</span>
          </button>

          <div className="flex items-center rounded-sm2 border border-line p-0.5">
            {(["en", "zh"] as Lang[]).map((code) => (
              <button
                key={code}
                onClick={() => onLang(code)}
                className="rounded-[7px] px-2 py-1 text-[11px] transition-colors duration-150"
                style={{
                  background: lang === code ? "var(--surface-2)" : "transparent",
                  color: lang === code ? "var(--text)" : "var(--text-3)",
                }}
              >
                {code === "en" ? "EN" : "中文"}
              </button>
            ))}
          </div>

          <button
            onClick={playing ? onStop : onPlay}
            className="ml-1 flex items-center gap-2 rounded-sm2 border border-line px-3 py-1.5 text-[11.5px] transition-colors duration-150"
            style={{
              color: playing ? "var(--text)" : "var(--text-2)",
              background: playing ? "var(--surface-2)" : "transparent",
            }}
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {playing ? ui.common.stop : ui.common.play}
          </button>
        </div>
      </div>
    </header>
  );
}
