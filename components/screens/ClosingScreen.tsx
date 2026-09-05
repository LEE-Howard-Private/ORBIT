"use client";

import { useLang, useUI } from "@/components/LangContext";
import { Mark } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import type { Scenario } from "@/lib/types";

export function ClosingScreen({ scenario, step }: { scenario: Scenario; step: number }) {
  const ui = useUI();
  const lang = useLang();
  const c = scenario.closing;
  const parts = c.statement.split(/(?<=[.。])\s*/).filter(Boolean);
  const lead = parts[0] ?? c.statement;
  const tail = parts.slice(1).join("");

  return (
    <div className="mx-auto flex min-h-[var(--screen-h)] w-full max-w-[880px] flex-col items-center justify-center px-6 text-center">
      <Reveal show={step >= 0} duration={1000} y={12} blur={0}>
        <p
          className={`display text-fg ${
            lang === "zh"
              ? "text-[clamp(26px,4.4vw,46px)] leading-[1.4]"
              : "text-[clamp(28px,4.8vw,54px)] leading-[1.18]"
          }`}
        >
          {lead}
          <br />
          <span className="text-fg3">{tail}</span>
        </p>
      </Reveal>

      <Reveal show={step >= 1} delay={260} duration={900}>
        <div className="mt-20 flex flex-col items-center">
          <Mark className="h-6 w-6 text-fg2" />
          <div className="mt-6 text-[clamp(18px,2.4vw,26px)] font-medium tracking-[0.42em] text-fg">
            ORBIT
          </div>
          <div className="mt-5 text-[12px] tracking-[0.2em] text-fg3">{c.positioning}</div>
        </div>
      </Reveal>

      <Reveal show={step >= 1} delay={900} duration={900}>
        <p className="mt-16 text-[13.5px] text-fg4">{ui.closing.strategic}</p>
      </Reveal>
    </div>
  );
}
