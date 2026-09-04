"use client";

import { useUI } from "@/components/LangContext";
import { Alert } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import type { Scenario, Stakeholder } from "@/lib/types";

type RowState = "queued" | "sent" | "replied";

function Row({ person, state }: { person: Stakeholder; state: RowState }) {
  const ui = useUI();
  const sent = state !== "queued";
  const replied = state === "replied";

  return (
    <div
      className="border-b border-line py-7 transition-opacity duration-500"
      style={{ opacity: sent ? 1 : 0.34 }}
    >
      <div className="flex items-baseline justify-between gap-6">
        <span className="flex items-baseline gap-3">
          <span className="text-[14.5px] text-fg">{person.name}</span>
          <span className="text-[12px] text-fg3">{person.role}</span>
        </span>
        <span
          className="shrink-0 text-[11.5px] transition-colors duration-500"
          style={{ color: replied ? "var(--accent)" : sent ? "var(--text-3)" : "var(--text-4)" }}
        >
          {replied ? `${ui.async.replied} · ${person.respondedIn}` : sent ? ui.async.waiting : ui.async.queued}
        </span>
      </div>

      <p className="mt-3.5 max-w-[62ch] text-[15px] leading-[1.6] text-fg2">{person.question}</p>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: replied ? 220 : 0,
          opacity: replied ? 1 : 0,
          transition: "max-height 620ms var(--ease), opacity 480ms var(--ease) 120ms",
        }}
      >
        <p
          className="mt-4 max-w-[62ch] border-l pl-5 text-[15px] leading-[1.6] text-fg"
          style={{ borderColor: "var(--line-strong)" }}
        >
          {person.answer}
        </p>

        {person.flag ? (
          <div
            className="mt-4 flex max-w-[62ch] items-start gap-3 pl-5"
            style={{
              opacity: replied ? 1 : 0,
              transition: "opacity 500ms var(--ease) 420ms",
            }}
          >
            <Alert className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="text-[12.5px] leading-relaxed text-fg3">
              <span className="text-accent">{person.flag.label}.</span> {person.flag.effect}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AsyncScreen({ scenario, step }: { scenario: Scenario; step: number }) {
  const ui = useUI();
  const people = scenario.stakeholders;
  const n = people.length;

  const stateFor = (i: number): RowState => {
    if (step >= 1 + n + i) return "replied";
    if (step >= 1 + i) return "sent";
    return "queued";
  };

  const replied = people.filter((_, i) => stateFor(i) === "replied").length;
  const escalating = people.some((p) => p.flag?.kind === "conflict");
  const done = step >= 1 + n * 2;

  return (
    <Stage wide>
      <Reveal show={step >= 0}>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="eyebrow">{ui.async.eyebrow}</div>
            <p className="mt-4 text-[15px] text-fg2">{ui.async.header(n)}</p>
          </div>
          <span className="tnum text-[12.5px] text-fg3">{ui.async.collected(replied, n)}</span>
        </div>
      </Reveal>

      <div className="mt-10">
        {people.map((person, i) => (
          <Row key={person.id} person={person} state={stateFor(i)} />
        ))}
      </div>

      <Reveal show={done} delay={140} className="mt-10">
        <div className="eyebrow mb-4">{escalating ? ui.async.escalating : ui.async.synthesis}</div>
        <p className="max-w-[68ch] text-[15.5px] leading-[1.7] text-fg2">{scenario.synthesis}</p>
        <p className="mt-5 text-[12px] text-fg4">{ui.async.noInvites}</p>
      </Reveal>
    </Stage>
  );
}
