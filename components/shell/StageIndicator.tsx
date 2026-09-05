"use client";

import { useUI } from "@/components/LangContext";

/** Where the film is: 03 / 10, the state's name, and one line about it. */
export function StageIndicator({
  index,
  total,
  state,
  visible,
  progress,
}: {
  index: number;
  total: number;
  state: string | undefined;
  visible: boolean;
  progress: number;
}) {
  const ui = useUI();
  const name = state ? ui.playback.states[state] : undefined;
  const blurb = state ? ui.playback.blurbs[state] : undefined;

  return (
    <div
      className="edge-with-narrator pointer-events-none fixed inset-x-0 top-[72px] z-30 flex justify-center px-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(-6px)",
        transition: "opacity var(--d-std) var(--ease), transform var(--d-std) var(--ease)",
      }}
      aria-hidden={!visible}
    >
      <div className="glass w-full max-w-[560px] rounded-md2 px-5 py-3.5">
        <div className="flex items-baseline gap-4">
          <span className="tnum text-[11px] text-fg4">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            {name}
          </span>
        </div>
        {blurb ? <p className="mt-2 text-[12.5px] leading-snug text-fg2">{blurb}</p> : null}
        <div className="mt-3 h-px w-full" style={{ background: "var(--line)" }}>
          <div
            className="h-full"
            style={{
              width: `${progress}%`,
              background: "var(--accent)",
              opacity: 0.7,
              transition: "width 400ms linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
