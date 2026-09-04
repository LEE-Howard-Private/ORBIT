"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/components/LangContext";
import { Chevron } from "@/components/ui/Icons";
import { Meter } from "@/components/ui/Meter";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import type { Scenario } from "@/lib/types";

export function RouteScreen({ scenario, step }: { scenario: Scenario; step: number }) {
  const ui = useUI();
  const a = scenario.analysis;
  const chosen = scenario.routes.find((r) => r.id === a.route);
  const others = scenario.routes.filter((r) => r.id !== a.route);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (step < 3) setOpen(false);
  }, [step]);

  const revealed = step >= 3;

  return (
    <Stage center>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.route.eyebrow}</div>
      </Reveal>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: revealed ? 620 : 0,
          transition: "max-height 900ms var(--ease)",
        }}
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
              {open ? ui.analysis.whyClose : ui.analysis.why}
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
                maxHeight: open ? 340 : 0,
                opacity: open ? 1 : 0,
                transition:
                  "max-height var(--d-major) var(--ease), opacity var(--d-std) var(--ease-soft)",
              }}
            >
              <div className="grid gap-x-14 gap-y-6 pt-8 sm:grid-cols-2">
                <Meter
                  label={ui.analysis.necessity}
                  value={a.necessity_score}
                  active={open}
                  emphasis
                  threshold={60}
                />
                <Meter
                  label={ui.analysis.sufficiency}
                  value={a.information_sufficiency}
                  active={open}
                  emphasis
                />
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <span className="text-[12.5px] text-fg2">{ui.analysis.complexity}</span>
                  <span className="text-[13px] text-fg">
                    {ui.levels[a.decision_complexity ?? ""] ?? a.decision_complexity}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <span className="text-[12.5px] text-fg2">{ui.analysis.realtime}</span>
                  <span className="text-[13px] text-fg">
                    {ui.levels[a.realtime_discussion ?? ""] ?? a.realtime_discussion}
                  </span>
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
              <span className="text-[13.5px] text-fg3">{route.name}</span>
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
