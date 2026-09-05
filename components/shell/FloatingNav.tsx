"use client";

import { useUI } from "@/components/LangContext";
import { Pause, Play, Search } from "@/components/ui/Icons";
import type { Lang } from "@/lib/i18n";

/** The window's toolbar: search, language, and the one-key demo. */
export function FloatingNav({
  lang,
  onLang,
  playing,
  onPlay,
  onStop,
  onPalette,
  dimmed,
}: {
  lang: Lang;
  onLang: (l: Lang) => void;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPalette: () => void;
  dimmed: boolean;
}) {
  const ui = useUI();

  return (
    <div
      className="flex items-center gap-1.5"
      style={{ opacity: dimmed ? 0.55 : 1, transition: "opacity var(--d-major) var(--ease)" }}
    >
      <button
        onClick={onPalette}
        className="hidden items-center gap-2 rounded-sm2 border border-line px-2.5 py-1 text-[11.5px] text-fg3 transition-colors duration-150 hover:border-lineStrong hover:text-fg2 sm:flex"
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
            className="rounded-[6px] px-2 py-[3px] text-[11px] transition-colors duration-150"
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
        className="ml-1 flex items-center gap-2 rounded-sm2 border px-2.5 py-1 text-[11.5px] transition-colors duration-150"
        style={{
          color: playing ? "var(--text)" : "var(--text-2)",
          borderColor: playing ? "var(--accent-line)" : "var(--line)",
          background: playing ? "var(--accent-quiet)" : "transparent",
        }}
      >
        {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        {playing ? ui.common.stop : ui.common.play}
      </button>
    </div>
  );
}
