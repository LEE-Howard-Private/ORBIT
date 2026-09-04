"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/components/LangContext";
import { Chevron } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import { readDecision } from "@/lib/decision";
import { factorValues, type FactorKey } from "@/lib/engine";
import type { RouteId, Scenario } from "@/lib/types";

const FACTOR_ORDER: FactorKey[] = [
  "information_sufficiency",
  "stakeholder_load",
  "stakeholder_complexity",
  "decision_ambiguity",
  "real_time_dependency",
  "urgency",
  "disagreement_potential",
  "decision_consequence",
];

function FactorRow({ label, value, show, delay }: { label: string; value: number; show: boolean; delay: number }) {
  return (
    <Reveal show={show} delay={delay} y={6} duration={480}>
      <div className="flex items-center gap-4 py-[7px]">
        <span className="w-[168px] shrink-0 text-[12.5px] text-fg2">{label}</span>
        <span className="relative h-px flex-1" style={{ background: "var(--line)" }}>
          <span
            className="absolute inset-y-0 left-0"
            style={{
              width: show ? `${value}%` : 0,
              background: "var(--text-3)",
              transition: `width 700ms var(--ease) ${delay + 80}ms`,
            }}
          />
        </span>
        <span className="tnum w-8 shrink-0 text-right text-[12.5px] text-fg">{value}</span>
      </div>
    </Reveal>
  );
}

export function RouteScreen({ scenario, step }: { scenario: Scenario; step: number }) {
  const ui = useUI();
  const a = scenario.analysis;
  const { engine } = readDecision(scenario);
  const routeId: RouteId = engine?.route ?? a.route;
  const chosen = scenario.routes.find((r) => r.id === routeId);
  const others = scenario.routes.filter((r) => r.id !== routeId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (step < 3) setOpen(false);
  }, [step]);

  const revealed = step >= 3;
  const values = a.factors ? factorValues(a.factors) : null;

  return (
    <Stage center>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.route.eyebrow}</div>
      </Reveal>

      <div
        className="overflow-hidden"
        style={{ maxHeight: revealed ? 900 : 0, transition: "max-height 900ms var(--ease)" }}
      >
        <Reveal show={revealed} delay={180} y={16} blur={9} duration={900}>
          <h1 className="display mt-8 text-[clamp(40px,6vw,72px)] text-fg">{chosen?.name}</h1>
        </Reveal>

        <Reveal show={revealed} delay={420} duration={800}>
          <p className="mt-7 max-w-[46ch] text-[clamp(17px,2.1vw,22px)] leading-[1.5] text-fg2">
            {a.headline ?? chosen?.selectedBecause}
          </p>
        </Reveal>

        <Reveal show={revealed} delay={620} duration={800}>
          <div className="mt-9 flex flex-wrap gap-x-12 gap-y-4">
            {engine ? (
              <span className="block">
                <span className="tnum block text-[22px] leading-none text-fg">
                  {engine.confidence}%
                </span>
                <span className="mt-2 block text-[12px] text-fg3">{ui.trace.confidence}</span>
              </span>
            ) : null}
            {chosen?.signals.slice(0, 2).map((s) => (
              <span key={s.label} className="block">
                <span className="tnum block text-[22px] leading-none text-fg">{s.value}</span>
                <span className="mt-2 block text-[12px] text-fg3">{s.label}</span>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal show={revealed} delay={780} duration={700}>
          <div className="mt-10">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 text-[13px] text-fg3 transition-colors duration-150 hover:text-fg"
              aria-expanded={open}
            >
              {open ? ui.trace.close : ui.trace.open}
              <span
                className="flex"
                style={{
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform var(--d-std) var(--ease)",
                }}
              >
                <Chevron className="h-3.5 w-3.5" />
              </span>
            </button>

            <div
              className="overflow-hidden"
              style={{
                maxHeight: open ? 480 : 0,
                opacity: open ? 1 : 0,
                transition:
                  "max-height var(--d-major) var(--ease), opacity var(--d-std) var(--ease-soft)",
              }}
            >
              <div className="grid gap-x-16 gap-y-10 pt-9 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="eyebrow mb-3">{ui.trace.factors}</div>
                  {values
                    ? FACTOR_ORDER.map((key, i) => (
                        <FactorRow
                          key={key}
                          label={ui.trace.factorNames[key]}
                          value={values[key]}
                          show={open}
                          delay={i * 55}
                        />
                      ))
                    : null}
                </div>

                <div>
                  <div className="eyebrow mb-3">{ui.trace.fit}</div>
                  {engine
                    ? scenario.routes.map((r, i) => {
                        const score = engine.scores[r.id];
                        const isChosen = r.id === routeId;
                        return (
                          <Reveal key={r.id} show={open} delay={140 + i * 90} y={6} duration={480}>
                            <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                              <span
                                className="text-[12.5px]"
                                style={{ color: isChosen ? "var(--accent)" : "var(--text-3)" }}
                              >
                                {ui.routeLabel[r.id]}
                              </span>
                              <span
                                className="tnum text-[14px]"
                                style={{ color: isChosen ? "var(--text)" : "var(--text-3)" }}
                              >
                                {score}
                              </span>
                            </div>
                          </Reveal>
                        );
                      })
                    : null}
                  <Reveal show={open} delay={420} duration={480}>
                    <p className="mt-3 text-[11.5px] leading-relaxed text-fg4">{ui.trace.fitNote}</p>
                  </Reveal>

                  {engine ? (
                    <Reveal show={open} delay={500} duration={480}>
                      <div className="mt-8">
                        <div className="eyebrow mb-3">{ui.trace.recommendation}</div>
                        <div className="text-[15px] text-fg">{ui.routeLabel[routeId]}</div>
                        <div className="tnum mt-1 text-[13px] text-fg3">
                          {ui.trace.confidence} {engine.confidence}%
                        </div>
                      </div>
                    </Reveal>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-14">
        <Reveal show={step >= 1} duration={600}>
          <div className="eyebrow mb-1">{ui.route.considered}</div>
        </Reveal>
        {others.map((route, i) => (
          <Reveal key={route.id} show={step >= i + 1} delay={80} duration={600}>
            <div className="flex items-start justify-between gap-8 border-b border-line py-4">
              <span className="flex items-baseline gap-3">
                <span className="text-[13.5px] text-fg3">{route.name}</span>
                {engine ? (
                  <span className="tnum text-[12px] text-fg4">{engine.scores[route.id]}</span>
                ) : null}
              </span>
              <span className="max-w-[46ch] text-right text-[12.5px] leading-relaxed text-fg4">
                {route.rejectedBecause}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Stage>
  );
}
