"use client";

import { useUI } from "@/components/LangContext";
import { ArrowRight } from "@/components/ui/Icons";

/** A quiet way to walk the narrative by hand. Six ticks, names on hover. */
export function Rail({
  index,
  total,
  onJump,
  onPrev,
  onNext,
  hidden,
}: {
  index: number;
  total: number;
  onJump: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  hidden: boolean;
}) {
  const ui = useUI();

  return (
    <div
      className="edge-with-narrator fixed inset-x-0 bottom-0 z-40 flex justify-center pb-6"
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(12px)" : "none",
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity var(--d-major) var(--ease), transform var(--d-major) var(--ease)",
      }}
    >
      <div className="glass flex items-center gap-1 rounded-full px-2 py-1.5">
        <button
          onClick={onPrev}
          disabled={index <= 0}
          className="btn-bare !px-2 disabled:opacity-25"
          aria-label={ui.common.back}
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        </button>

        <div className="flex items-center gap-0.5 px-1">
          {ui.screens.slice(0, total).map((name, i) => (
            <button key={name} onClick={() => onJump(i)} className="group relative px-2 py-2" aria-label={name}>
              <span
                className="block h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 22 : 14,
                  background: i === index ? "var(--text)" : "var(--text-4)",
                }}
              />
              <span
                className="pointer-events-none absolute bottom-[26px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] transition-opacity duration-200 group-hover:opacity-100"
                style={{ opacity: i === index ? 1 : 0, color: i === index ? "var(--text-2)" : "var(--text-3)" }}
              >
                {name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={index >= total - 1}
          className="btn-bare !px-2 disabled:opacity-25"
          aria-label={ui.common.next}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
