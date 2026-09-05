"use client";

import { useRef, useState } from "react";
import { useUI } from "@/components/LangContext";
import { Dot } from "@/components/ui/Dot";
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

  const constraints = a.constraints ?? [];
  const gaps = a.questions.map((q) => `${q.role} — ${q.topic ?? q.question}`);

  const answers = [
    scenario.requester.role,
    `${roles.length}`,
    `${constraints.length}`,
    `${gaps.length}`,
    ui.routeLabel[engineRoute],
  ];

  const orbitProgress = Math.min(1, Math.max(0, (step - 1) / 3));

  return (
    <Stage center wide>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.analysis.eyebrow}</div>
      </Reveal>

      <Reveal show={step >= 1} delay={80} className="mt-6">
        <Orbit names={roles} progress={orbitProgress} settled={Math.max(0, Math.min(roles.length, step - 1))} />
      </Reveal>

      {/* the analysis itself floats above the screen */}
      <div className="mt-8 grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <Reveal show={step >= 0} delay={60}>
        <div className="card-lg px-6 py-1.5 md:px-7">
          {ui.analysis.steps.map((label, i) => {
            const done = step > i;
            const running = step === i;
            const seen = step >= i;
            return (
              <Reveal key={label} show={seen} delay={40}>
                <div
                  className="flex items-center justify-between gap-6 border-b border-line py-3.5 last:border-b-0 transition-opacity duration-700"
                  style={{ opacity: done ? 0.66 : running ? 1 : 0.3 }}
                >
                  <span className="flex items-center gap-3.5">
                    <Dot state={done ? "done" : running ? "active" : "idle"} />
                    <span className="text-[14.5px] text-fg">{label}</span>
                  </span>
                  <span
                    className="tnum shrink-0 text-[13px] text-fg3 transition-opacity duration-700"
                    style={{ opacity: done ? 1 : 0 }}
                  >
                    {answers[i]}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {constraints.length || gaps.length ? (
        <Reveal show={step >= 2} delay={100} className="lg:row-span-2">
          <div className="card-lg grid gap-x-12 gap-y-8 px-6 py-6 sm:grid-cols-2 md:px-7 lg:grid-cols-1">
            {constraints.length ? (
              <div>
                <div className="eyebrow mb-4">{ui.analysis.constraints}</div>
                <ul className="space-y-3">
                  {constraints.map((item, i) => (
                    <Reveal key={item} show={step >= 2} delay={200 + i * 110} y={6}>
                      <li className="flex gap-3 text-[13.5px] leading-[1.6] text-fg2">
                        <Dot state="idle" className="mt-[8px]" />
                        <span>{item}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}

            {gaps.length ? (
              <div style={{ opacity: step >= 3 ? 1 : 0, transition: "opacity 620ms var(--ease)" }}>
                <div className="eyebrow mb-4">{ui.analysis.gaps}</div>
                <ul className="space-y-3">
                  {gaps.map((item, i) => (
                    <Reveal key={item} show={step >= 3} delay={200 + i * 110} y={6}>
                      <li className="flex gap-3 text-[13.5px] leading-[1.6] text-fg2">
                        <Dot state="alert" className="mt-[8px]" />
                        <span>{item}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      <Reveal show={step >= 4} delay={120}>
        <div className="card-lg px-6 py-6 md:px-7">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <div className="eyebrow mb-3">{ui.cost.label}</div>
              <div className="stat text-[clamp(28px,3.4vw,40px)] text-accentText">
                {ntd(cost?.total ?? a.estimated_cost)}
              </div>
            </div>

            {cost ? (
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
                className="flex items-center gap-2 text-[12px] text-fg3 transition-colors duration-150 hover:text-fg"
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
            ) : null}
          </div>

          {cost ? (
            <div
              ref={mathRef}
              className="overflow-hidden"
              style={{
                maxHeight: showMath ? 210 : 0,
                opacity: showMath ? 1 : 0,
                transition:
                  "max-height var(--d-major) var(--ease), opacity var(--d-std) var(--ease-soft)",
              }}
            >
              <div className="mt-6 max-w-[420px]">
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
          ) : null}
        </div>
      </Reveal>
      </div>
    </Stage>
  );
}
