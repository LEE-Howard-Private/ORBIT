"use client";

import { useUI } from "@/components/LangContext";
import { Composer } from "@/components/ui/Composer";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { useTypewriter } from "@/components/ui/useTypewriter";
import type { Scenario } from "@/lib/types";

export function HomeScreen({
  scenario,
  scenarios,
  step,
  autoplay,
  value,
  onChange,
  onSubmit,
  onOpenScenario,
  busy,
  error,
}: {
  scenario: Scenario;
  scenarios: Scenario[];
  step: number;
  autoplay: boolean;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onOpenScenario: (s: Scenario) => void;
  busy: boolean;
  error: string | null;
}) {
  const ui = useUI();
  const typed = useTypewriter(scenario.request, autoplay && step >= 1, 13);
  const submitting = autoplay && step >= 2;

  return (
    <div className="mx-auto flex min-h-[var(--screen-h)] w-full max-w-[820px] flex-col justify-center px-6 pb-28 pt-28 md:px-8">
      <Reveal show={!submitting} duration={520}>
        <h1 className="display mx-auto max-w-[16ch] text-center text-[clamp(34px,5.2vw,62px)] text-fg">
          {ui.hero.headline}
        </h1>
      </Reveal>

      <div className="mt-9 md:mt-10">
        <Composer
          value={autoplay ? typed : value}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={ui.hero.placeholder}
          hint={ui.hero.hint}
          busy={busy || submitting}
          readOnly={autoplay}
          caret={autoplay && step >= 1 && !submitting}
        />
      </div>

      {error ? (
        <p className="mt-4 text-center text-[12.5px] text-accent">{error}</p>
      ) : (
        <Reveal show={!submitting} delay={120} duration={520}>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[13px] text-fg3">
            {ui.hero.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>
      )}

      <Reveal show={!submitting} delay={220} duration={520} className="mt-14 md:mt-16">
        <div className="eyebrow mb-1">{ui.hero.recent}</div>
        <ul>
          {scenarios.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onOpenScenario(s)}
                disabled={autoplay}
                className="nudge group flex w-full items-center justify-between gap-6 border-b border-line py-4 text-left transition-colors duration-150 hover:border-lineStrong"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] text-fg2 transition-colors duration-150 group-hover:text-fg">
                    {s.title}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[11.5px] tracking-[0.14em] text-fg4 sm:block">
                  {ui.routeLabel[s.analysis.route]}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-fg4 transition-colors duration-150 group-hover:text-fg2" />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
