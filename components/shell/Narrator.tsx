"use client";

import { useEffect, useRef } from "react";
import { useUI } from "@/components/LangContext";
import { Chevron, Mark } from "@/components/ui/Icons";
import type { NarratorLine } from "@/lib/narration";

function Line({ line, ui }: { line: NarratorLine; ui: ReturnType<typeof useUI> }) {
  return (
    <div className="animate-sweepIn">
      {line.status ? (
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-accent animate-breathe" />
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            {line.status}
          </span>
        </div>
      ) : null}

      {line.text ? (
        <p
          className={`leading-[1.6] ${
            line.emphasis ? "text-[14.5px] text-fg" : "text-[13.5px] text-fg2"
          }`}
        >
          {line.text}
        </p>
      ) : null}

      {line.items?.length ? (
        <ul className="mt-3 space-y-1.5">
          {line.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[12.5px] leading-relaxed text-fg3">
              <span className="mt-[9px] h-px w-2 shrink-0" style={{ background: "var(--text-4)" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {line.metrics?.length ? (
        <div className="mt-3.5">
          {line.metrics.map((m) => (
            <div
              key={m.label}
              className="flex items-baseline justify-between gap-4 border-b border-line py-2"
            >
              <span className="text-[12px] text-fg3">{m.label}</span>
              <span className="tnum text-[13px] text-fg">{m.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      {line.route ? (
        <div className="mt-1 border-t border-line pt-5">
          <div className="eyebrow mb-2">{ui.trace.recommendation}</div>
          <div className="text-[17px] tracking-[0.04em]" style={{ color: "var(--accent)" }}>
            {ui.routeLabel[line.route]}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Narrator({
  lines,
  idle,
  open,
  onToggle,
}: {
  lines: NarratorLine[];
  idle: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const ui = useUI();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lines.length]);

  return (
    <>
      {/* collapsed handle */}
      <button
        onClick={onToggle}
        aria-label={ui.narrator.expand}
        className="glass fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-2 rounded-l-md2 border-r-0 px-2.5 py-5 text-fg3 transition-colors duration-150 hover:text-fg lg:flex"
        style={{
          opacity: open ? 0 : 1,
          pointerEvents: open ? "none" : "auto",
          transition: "opacity var(--d-std) var(--ease)",
        }}
      >
        <span className="flex rotate-180" style={{ writingMode: "vertical-rl" }}>
          <span className="text-[10px] uppercase tracking-[0.22em]">{ui.narrator.title}</span>
        </span>
      </button>

      {/* collapsed handle, small screens */}
      <button
        onClick={onToggle}
        className="glass fixed bottom-[86px] left-6 z-40 flex items-center gap-2 rounded-full px-3.5 py-2 text-[11.5px] text-fg3 transition-opacity duration-200 lg:hidden"
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
      >
        <Mark className="h-3.5 w-3.5" />
        {ui.narrator.title}
      </button>

      <aside
        className={`glass fixed z-40 flex flex-col border-r-0 transition-transform duration-500 ease-cine lg:inset-y-0 lg:right-0 lg:w-[352px] ${
          open ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-y-0 lg:translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between gap-3 px-6 pb-5 pt-7">
          <div className="flex items-center gap-2.5">
            <Mark className="h-4 w-4 text-fg3" />
            <span className="eyebrow">{ui.narrator.title}</span>
          </div>
          <button
            onClick={onToggle}
            aria-label={ui.narrator.collapse}
            className="btn-bare !px-1.5 rotate-0 lg:-rotate-90"
          >
            <Chevron className="h-3.5 w-3.5" />
          </button>
        </header>

        <div
          ref={scroller}
          className="scrollbar-none flex-1 space-y-7 overflow-y-auto px-6 pb-6"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, #000 22px)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22px)",
          }}
        >
          {idle || lines.length === 0 ? (
            <p className="max-w-[30ch] text-[13.5px] leading-[1.65] text-fg3">{ui.narrator.idle}</p>
          ) : (
            lines.map((line) => <Line key={line.id} line={line} ui={ui} />)
          )}
        </div>

        <footer className="border-t border-line px-6 py-4">
          <p className="text-[10.5px] leading-relaxed text-fg4">{ui.narrator.demoNote}</p>
        </footer>
      </aside>
    </>
  );
}
