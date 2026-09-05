"use client";

import { useUI } from "@/components/LangContext";
import { Dot } from "@/components/ui/Dot";

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
      className="edge-with-narrator pointer-events-none fixed inset-x-0 z-30 flex justify-center px-6"
      style={{
        top: "calc(var(--titlebar) + 18px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(-6px)",
        transition: "opacity var(--d-std) var(--ease), transform var(--d-std) var(--ease)",
      }}
      aria-hidden={!visible}
    >
      <div className="card w-full max-w-[560px] px-5 py-3.5">
        <div className="flex items-baseline gap-4">
          <span className="tnum text-[11px] text-fg4">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-2.5">
            <Dot state="active" />
            <span className="eyebrow" style={{ color: "var(--text)" }}>
              {name}
            </span>
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
