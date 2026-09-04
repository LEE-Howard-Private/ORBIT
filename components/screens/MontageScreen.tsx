"use client";

import { useUI } from "@/components/LangContext";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import { ntd } from "@/lib/format";
import type { Scenario } from "@/lib/types";

/** Proof that it routes: the same engine reaching three different verdicts. */
export function MontageScreen({
  scenarios,
  step,
  focusId,
  onSelect,
}: {
  scenarios: Scenario[];
  step: number;
  focusId: string;
  onSelect?: (s: Scenario) => void;
}) {
  const ui = useUI();

  return (
    <Stage center wide>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.montage.eyebrow}</div>
        <h1 className="display mt-6 max-w-[20ch] text-[clamp(32px,4.6vw,54px)] text-fg">
          {ui.montage.title}
        </h1>
      </Reveal>

      <div className="mt-14">
        {scenarios.map((s, i) => {
          const decided = step >= i + 1;
          const focused = step >= 4 && s.id === focusId;
          const faded = step >= 4 && s.id !== focusId;

          return (
            <Reveal key={s.id} show={step >= 0} delay={i * 90}>
              <button
                onClick={() => onSelect?.(s)}
                className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-x-8 gap-y-2 border-b border-line py-7 text-left transition-all duration-500 md:grid-cols-[1fr_92px_auto]"
                style={{ opacity: faded ? 0.36 : 1 }}
              >
                <span className="min-w-0">
                  <span className="eyebrow block">{s.requester.role}</span>
                  <span
                    className="mt-2 block text-[clamp(16px,1.9vw,20px)] leading-snug transition-colors duration-500"
                    style={{ color: focused ? "var(--text)" : "var(--text-2)" }}
                  >
                    {s.shortRequest ?? s.request}
                  </span>
                </span>

                <span className="hidden text-right md:block">
                  <span className="eyebrow block">{ui.montage.asRequested}</span>
                  <span className="tnum mt-2 block text-[13px] text-fg3">
                    {ntd(s.analysis.estimated_cost)}
                  </span>
                </span>

                <span className="text-right">
                  {decided ? (
                    <span className="animate-sweepIn block">
                      <span className="tnum block text-[clamp(22px,2.6vw,30px)] leading-none text-fg">
                        {s.analysis.necessity_score}
                        <span className="text-fg4">%</span>
                      </span>
                      <span
                        className="mt-2.5 block text-[11px] tracking-[0.18em]"
                        style={{ color: focused ? "var(--accent)" : "var(--text-3)" }}
                      >
                        {ui.routeLabel[s.analysis.route]}
                      </span>
                    </span>
                  ) : (
                    <span className="block text-[11px] tracking-[0.18em] text-fg4 animate-breathe">
                      {ui.montage.routing}
                    </span>
                  )}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      <Reveal show={step >= 4} delay={220}>
        <p className="mt-10 text-[13px] text-fg3">{ui.montage.following}</p>
      </Reveal>
    </Stage>
  );
}
