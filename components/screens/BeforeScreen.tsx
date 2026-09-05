"use client";

import { useUI } from "@/components/LangContext";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import type { Scenario } from "@/lib/types";

/** The state of the world this request lands in today. */
export function BeforeScreen({ scenario, step }: { scenario: Scenario; step: number }) {
  const ui = useUI();
  const { intro, before } = scenario;

  return (
    <Stage center wide>
      <Reveal show={step >= 0}>
        <div className="eyebrow">{ui.before.eyebrow}</div>
      </Reveal>

      <Reveal show={step >= 0} delay={80}>
        <h1 className="display mt-6 max-w-[18ch] text-[clamp(36px,5.4vw,64px)] text-fg">
          {intro.headline}
          <br />
          <span className="text-fg3">{intro.subhead}</span>
        </h1>
      </Reveal>

      <Reveal show={step >= 1} delay={60}>
        <div className="mt-14">
          <div className="eyebrow mb-5">{ui.before.today}</div>
          <p className="max-w-[62ch] text-[15px] leading-[2.1] text-fg3">
            {before.chain.map((node, i) => (
              <span key={node}>
                <span
                  className="transition-colors duration-500"
                  style={{
                    color: i === before.chain.length - 1 ? "var(--text)" : undefined,
                    transitionDelay: `${i * 120}ms`,
                  }}
                >
                  {node}
                </span>
                {i < before.chain.length - 1 ? (
                  <span className="px-2.5 text-fg4">→</span>
                ) : null}
              </span>
            ))}
          </p>
        </div>
      </Reveal>

      <Reveal show={step >= 2} delay={60}>
        <div className="mt-12">
          <div className="eyebrow mb-6">{ui.before.cost}</div>
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {before.cost.map((item, i) => (
              <Reveal key={item.label} show={step >= 2} delay={140 + i * 110}>
                <div>
                  <div
                    className="tnum text-[clamp(26px,3.2vw,38px)] leading-none"
                    style={{
                      color: item.label.toLowerCase().includes("cost") || item.label.includes("成本")
                        ? "var(--accent)"
                        : "var(--text)",
                    }}
                  >
                    {item.value}
                  </div>
                  <div className="mt-2.5 text-[12px] text-fg3">{item.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal show={step >= 3} delay={60}>
        <div className="mt-14 max-w-[58ch]">
          <p className="text-[clamp(17px,2vw,21px)] leading-[1.55] text-fg">{before.verdict}</p>
          {before.note ? <p className="mt-4 text-[13.5px] leading-relaxed text-fg3">{before.note}</p> : null}
        </div>
      </Reveal>
    </Stage>
  );
}
