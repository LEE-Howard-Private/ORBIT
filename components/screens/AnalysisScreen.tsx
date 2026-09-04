"use client";

import { useRef, useState } from "react";
import { useUI } from "@/components/LangContext";
import { Check, Ring, Spinner } from "@/components/ui/Icons";
import { Orbit } from "@/components/ui/Orbit";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import { Chevron } from "@/components/ui/Icons";
import { readDecision } from "@/lib/decision";
import { ntd } from "@/lib/format";
import type { Scenario } from "@/lib/types";

export function AnalysisScreen({ scenario, step }: { scenario: Scenario; step: number }) {
  const ui = useUI();
  const a = scenario.analysis;
  const roles = a.questions.map((q) => q.role);
  const { cost, engine } = readDecision(scenario);
  const engineRoute = engine?.route ?? a.route;
  const [showMath, setShowMath] = useState(false);
  const mathRef = useRef<HTMLDivElement>(null);

  const answers = [
    scenario.requester.role,
    `${roles.length}`,
    `${a.information_sufficiency}%`,
    ui.levels[a.decision_complexity ?? ""] ?? a.decision_complexity ?? "",
    ui.routeLabel[engineRoute],
  ];

  const orbitProgress = Math.min(1, Math.max(0, (step - 1) / 3));

  return (
    <Stage center>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.analysis.eyebrow}</div>
      </Reveal>

      <Reveal show={step >= 1} delay={80} className="mt-8">
        <Orbit names={roles} progress={orbitProgress} settled={Math.max(0, Math.min(roles.length, step - 1))} />
      </Reveal>

      <div className="mt-10">
        {ui.analysis.steps.map((label, i) => {
          const done = step > i;
          const running = step === i;
          const seen = step >= i;
          return (
            <Reveal key={label} show={seen} delay={40}>
              <div
                className="flex items-center justify-between gap-6 border-b border-line py-4 transition-opacity duration-500"
                style={{ opacity: done ? 0.62 : running ? 1 : 0.32 }}
              >
                <span className="flex items-center gap-3.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    {done ? (
                      <Check className="h-3.5 w-3.5 text-accent" />
                    ) : running ? (
                      <Spinner className="h-3.5 w-3.5 text-fg2" />
                    ) : (
                      <Ring className="h-3 w-3 text-fg4" />
                    )}
                  </span>
                  <span className="text-[15px] text-fg">{label}</span>
                </span>
                <span
                  className="tnum shrink-0 text-[13px] text-fg3 transition-opacity duration-500"
                  style={{ opacity: done ? 1 : 0 }}
                >
                  {answers[i]}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>

      {a.information_sources?.length ? (
        <Reveal show={step >= 3} delay={120} className="mt-10">
          <div className="eyebrow mb-4">{ui.analysis.basedOn}</div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {a.information_sources.map((source, i) => (
              <Reveal key={source.label} show={step >= 3} delay={200 + i * 110}>
                <span className="flex items-center gap-2.5 text-[13.5px] text-fg2">
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{
                      background:
                        source.status === "available"
                          ? "var(--accent)"
                          : source.status === "partial"
                          ? "var(--text-3)"
                          : "var(--text-4)",
                    }}
                  />
                  {source.label}
                </span>
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : null}

      <Reveal show={step >= 4} delay={120} className="mt-10">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-[13px] text-fg3">{ui.cost.label}</span>
          <span className="tnum text-[22px] text-accent">{ntd(cost?.total ?? a.estimated_cost)}</span>
        </div>

        {cost ? (
          <div className="mt-3">
            <button
              onClick={() => {
                const next = !showMath;
                setShowMath(next);
                if (next) {
                  setTimeout(
                    () => mathRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
                    260
                  );
                }
              }}
              className="flex items-center gap-2 text-[12px] text-fg4 transition-colors duration-150 hover:text-fg2"
              aria-expanded={showMath}
            >
              {showMath ? ui.cost.hide : ui.cost.show}
              <span
                className="flex"
                style={{
                  transform: showMath ? "rotate(180deg)" : "none",
                  transition: "transform var(--d-std) var(--ease)",
                }}
              >
                <Chevron className="h-3 w-3" />
              </span>
            </button>

            <div
              ref={mathRef}
              className="overflow-hidden"
              style={{
                maxHeight: showMath ? 190 : 0,
                opacity: showMath ? 1 : 0,
                transition:
                  "max-height var(--d-major) var(--ease), opacity var(--d-std) var(--ease-soft)",
              }}
            >
              <div className="mt-5 max-w-[420px]">
                <div className="flex items-baseline justify-between gap-4 border-b border-line py-2">
                  <span className="text-[12.5px] text-fg3">{ui.cost.participants}</span>
                  <span className="tnum text-[13px] text-fg">{cost.participants}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line py-2">
                  <span className="text-[12.5px] text-fg3">{ui.cost.duration}</span>
                  <span className="tnum text-[13px] text-fg">{cost.minutes} min</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line py-2">
                  <span className="text-[12.5px] text-fg3">{ui.cost.rate}</span>
                  <span className="tnum text-[13px] text-fg">{ntd(cost.rate)} / h</span>
                </div>
                <div className="tnum mt-3 text-[12.5px] text-fg2">
                  {cost.participants} × {cost.hours} h × {ntd(cost.rate)} = {ntd(cost.total)}
                </div>
                <p className="mt-2 text-[11.5px] text-fg4">{ui.cost.assumption}</p>
              </div>
            </div>
          </div>
        ) : null}
      </Reveal>

    </Stage>
  );
}
