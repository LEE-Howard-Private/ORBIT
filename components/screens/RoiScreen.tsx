"use client";

import { useUI } from "@/components/LangContext";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import { useCountUp } from "@/components/ui/useCountUp";
import { ntd } from "@/lib/format";
import type { Scenario } from "@/lib/types";

export function RoiScreen({
  scenario,
  step,
  autoplay,
  onContinue,
}: {
  scenario: Scenario;
  step: number;
  autoplay: boolean;
  onContinue: () => void;
}) {
  const ui = useUI();
  const { roi } = scenario;
  const saving = useCountUp(roi.savingAmount, step >= 2, 1200);

  return (
    <Stage center>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.roi.eyebrow}</div>
      </Reveal>

      <div className="mt-12 grid gap-y-10 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-x-12">
        <Reveal show={step >= 0} delay={100}>
          <div>
            <div className="eyebrow mb-6">{ui.roi.before}</div>
            <ul className="space-y-4">
              {roi.rows.map((row) => (
                <li key={row.metric}>
                  <div className="text-[17px] leading-tight text-fg3">{row.before}</div>
                  <div className="mt-1 text-[11.5px] text-fg4">{row.metric}</div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal show={step >= 1} delay={100} className="hidden self-center sm:block">
          <ArrowRight className="h-5 w-5 text-fg4" />
        </Reveal>

        <Reveal show={step >= 1} delay={220}>
          <div>
            <div className="eyebrow mb-6">{ui.roi.after}</div>
            <ul className="space-y-4">
              {roi.rows.map((row, i) => (
                <Reveal key={row.metric} show={step >= 1} delay={260 + i * 110}>
                  <li>
                    <div className="text-[17px] leading-tight text-fg">{row.after}</div>
                    <div className="mt-1 text-[11.5px] text-fg4">{row.metric}</div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {roi.transform ? (
        <Reveal show={step >= 2} delay={120} y={14} blur={0} duration={900}>
          <div className="mt-16 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="display text-[clamp(34px,5.4vw,64px)] leading-none text-fg3">
              {roi.transform.from}
            </span>
            <span className="text-[clamp(26px,4vw,44px)] leading-none text-fg4">→</span>
            <span className="display text-[clamp(34px,5.4vw,64px)] leading-none text-fg">
              {roi.transform.to}
            </span>
          </div>
        </Reveal>
      ) : null}

      <Reveal show={step >= 2} delay={340} duration={800}>
        <p className="mt-9 max-w-[52ch] text-[clamp(16px,1.9vw,20px)] leading-[1.55] text-fg2">
          {roi.headline}
        </p>
      </Reveal>

      <Reveal show={step >= 2} delay={520}>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="stat text-[clamp(30px,3.8vw,42px)] text-accentText">{ntd(saving)}</div>
            <div className="mt-2.5 text-[12px] text-fg3">{ui.roi.saving}</div>
          </div>
          {!autoplay ? (
            <button onClick={onContinue} className="btn-quiet nudge">
              {ui.roi.finish}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </Reveal>
    </Stage>
  );
}
