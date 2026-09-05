"use client";

import { useUI } from "@/components/LangContext";
import { Dot } from "@/components/ui/Dot";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import type { Scenario, Stakeholder } from "@/lib/types";

type RowState = "queued" | "sent" | "replied";

/** One outstanding question, floating above the screen. */
function Card({ person, state }: { person: Stakeholder; state: RowState }) {
  const ui = useUI();
  const sent = state !== "queued";
  const replied = state === "replied";

  return (
    <div
      className="card px-6 py-5 transition-all duration-700"
      style={{
        opacity: sent ? 1 : 0.4,
        transform: sent ? "none" : "translateY(4px)",
        borderColor: replied ? "rgba(255,255,255,0.12)" : undefined,
      }}
    >
      <div className="flex items-baseline justify-between gap-6">
        <span className="flex items-baseline gap-3">
          <span className="text-[14.5px] text-fg">{person.name}</span>
          <span className="text-[12px] text-fg3">{person.role}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2.5">
          <Dot state={replied ? "done" : sent ? "active" : "idle"} />
          <span
            className="text-[11.5px] transition-colors duration-500"
            style={{ color: replied ? "var(--text-2)" : sent ? "var(--text-3)" : "var(--text-4)" }}
          >
            {replied ? `${ui.async.replied} · ${person.respondedIn}` : sent ? ui.async.waiting : ui.async.queued}
          </span>
        </span>
      </div>

      <p className="mt-3.5 max-w-[62ch] text-[15px] leading-[1.6] text-fg2">{person.question}</p>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: replied ? 240 : 0,
          opacity: replied ? 1 : 0,
          transition: "max-height 700ms var(--ease), opacity 560ms var(--ease) 140ms",
        }}
      >
        <p
          className="mt-4 max-w-[62ch] border-l pl-5 text-[15px] leading-[1.6] text-fg"
          style={{ borderColor: "var(--accent-line)" }}
        >
          {person.answer}
        </p>

        {person.flag ? (
          <div
            className="mt-4 flex max-w-[62ch] items-start gap-3 pl-5"
            style={{
              opacity: replied ? 1 : 0,
              transition: "opacity 560ms var(--ease) 440ms",
            }}
          >
            <Dot state="alert" className="mt-[7px]" />
            <span className="text-[12.5px] leading-[1.6] text-fg3">
              <span className="text-fg2">{person.flag.label}.</span> {person.flag.effect}
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
          <span className="flex items-center gap-2.5">
            <Dot state={done ? "done" : "active"} />
            <span className="tnum text-[12.5px] text-fg3">{ui.async.collected(replied, n)}</span>
          </span>
        </div>
      </Reveal>

      <div className="mt-10 space-y-3.5">
        {people.map((person, i) => (
          <Card key={person.id} person={person} state={stateFor(i)} />
        ))}
      </div>

      <Reveal show={done} delay={140} className="mt-10">
        <div className="eyebrow mb-4 flex items-center gap-2.5">
          <Dot state={escalating ? "alert" : "done"} />
          {escalating ? ui.async.escalating : ui.async.synthesis}
        </div>
        <p className="max-w-[68ch] text-[15.5px] leading-[1.7] text-fg2">{scenario.synthesis}</p>
        <p className="mt-5 text-[12px] text-fg4">{ui.async.noInvites}</p>
      </Reveal>
    </Stage>
  );
}
