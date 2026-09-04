"use client";

import { useState } from "react";
import { useUI } from "@/components/LangContext";
import { ArrowRight, Check, Chevron, Spinner } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Stage } from "@/components/ui/Stage";
import type { Scenario } from "@/lib/types";

export function BriefScreen({
  scenario,
  step,
  autoplay,
  onApprove,
  onContinue,
}: {
  scenario: Scenario;
  step: number;
  autoplay: boolean;
  onApprove: () => void;
  onContinue: () => void;
}) {
  const ui = useUI();
  const d = scenario.analysis.decision;
  const a = scenario.analysis;
  const [openEvidence, setOpenEvidence] = useState<string | null>(null);
  const shown = step >= 1;
  const approved = step >= 2;

  // Some briefs lead with a field that just restates the title; don't say it twice.
  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, "");
  const first = d.fields[0];
  const duplicate = first ? norm(d.title).includes(norm(first.value).slice(0, 14)) : false;
  const hero = duplicate ? undefined : first;
  const rest = duplicate ? d.fields : d.fields.slice(1);

  return (
    <Stage wide>
      <Reveal show={step === 0}>
        <div className="flex items-center gap-2.5 text-[13px] text-fg3">
          <Spinner className="h-3.5 w-3.5" />
          {ui.brief.eyebrow}
        </div>
      </Reveal>

      <Reveal show={shown}>
        <div className="flex items-center gap-2.5">
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            {d.status ?? ui.brief.eyebrow}
          </span>
        </div>
        <h1 className="display mt-6 max-w-[20ch] text-[clamp(30px,4.2vw,50px)] text-fg">{d.title}</h1>
      </Reveal>

      <Reveal show={shown} delay={160}>
        <div className="mt-12 flex flex-wrap items-end gap-x-16 gap-y-8">
          {hero ? (
            <div>
              <div className="eyebrow mb-3">{hero.label}</div>
              <div className="display text-[clamp(34px,5vw,58px)] leading-none text-fg">
                {hero.value}
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <div className="tnum text-[22px] leading-none text-fg">{a.confidence}%</div>
              <div className="mt-2 text-[12px] text-fg3">{ui.brief.confidence}</div>
            </div>
            <div>
              <div className="text-[15px] leading-none text-fg">{ui.routeLabel[a.route]}</div>
              <div className="mt-2 text-[12px] text-fg3">
                {scenario.stakeholders.length} {ui.brief.stakeholders} · {a.questions.length}{" "}
                {ui.brief.openQuestions}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal show={shown} delay={280}>
        <p className="mt-12 max-w-[64ch] text-[16px] leading-[1.75] text-fg2">{d.recommendation}</p>
      </Reveal>

      {a.information_sources?.length ? (
        <Reveal show={shown} delay={400} className="mt-14">
          <div className="mb-1 flex items-baseline justify-between gap-4">
            <span className="eyebrow">{ui.brief.evidence}</span>
            <span className="text-[10.5px] text-fg4">{ui.evidenceNote}</span>
          </div>
          {a.information_sources.map((source) => {
            const open = openEvidence === source.label;
            return (
              <button
                key={source.label}
                onClick={() => setOpenEvidence(open ? null : source.label)}
                className="block w-full border-b border-line py-4 text-left transition-colors duration-150 hover:border-lineStrong"
              >
                <span className="flex items-center justify-between gap-6">
                  <span className="text-[14.5px] text-fg2">{source.label}</span>
                  <span
                    className="flex text-fg4"
                    style={{
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform var(--d-std) var(--ease)",
                    }}
                  >
                    <Chevron className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span
                  className="block overflow-hidden"
                  style={{
                    maxHeight: open ? 90 : 0,
                    opacity: open ? 1 : 0,
                    transition: "max-height var(--d-std) var(--ease), opacity var(--d-std) var(--ease)",
                  }}
                >
                  <span className="mt-3 block max-w-[60ch] text-[13.5px] leading-relaxed text-fg3">
                    {source.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </Reveal>
      ) : null}

      {d.meeting_brief ? (
        <Reveal show={shown} delay={440} className="mt-14">
          <div className="eyebrow mb-6">{ui.meetingBrief.title}</div>

          <p className="max-w-[62ch] text-[16px] leading-[1.7] text-fg">
            {d.meeting_brief.objective}
          </p>

          <div className="mt-9 grid gap-x-14 gap-y-9 sm:grid-cols-2">
            {[
              { label: ui.meetingBrief.decisions, items: d.meeting_brief.decisions },
              { label: ui.meetingBrief.participants, items: d.meeting_brief.participants },
              { label: ui.meetingBrief.preread, items: d.meeting_brief.preread },
              { label: ui.meetingBrief.questions, items: d.meeting_brief.questions },
            ].map((group, gi) => (
              <Reveal key={group.label} show={shown} delay={520 + gi * 110}>
                <div>
                  <div className="eyebrow mb-3">{group.label}</div>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-fg2">
                        <span className="mt-[9px] h-px w-2.5 shrink-0" style={{ background: "var(--text-4)" }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : null}

      <Reveal show={shown} delay={480} className="mt-12">
        <dl className="grid gap-x-14 gap-y-5 sm:grid-cols-2">
          {rest.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-5 border-b border-line pb-3">
              <dt className="text-[12.5px] text-fg3">{f.label}</dt>
              <dd className="text-right text-[13.5px] text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal show={shown} delay={560} className="mt-14">
        {approved ? (
          <div>
            <div className="flex items-center gap-2.5 text-[13.5px] text-accent">
              <Check className="h-4 w-4" />
              {ui.brief.approved} · {d.owner}
            </div>
            {d.post_approval?.length ? (
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {d.post_approval.map((item, i) => (
                  <Reveal key={item} show={approved} delay={200 + i * 130}>
                    <li className="flex items-start gap-2.5 text-[13px] leading-relaxed text-fg3">
                      <Check className="mt-[3px] h-3 w-3 shrink-0 text-fg4" />
                      {item}
                    </li>
                  </Reveal>
                ))}
              </ul>
            ) : null}
            {!autoplay ? (
              <button onClick={onContinue} className="btn-quiet nudge mt-8">
                {ui.brief.seeResult}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            <button onClick={onApprove} disabled={autoplay} className="btn-solid">
              {ui.brief.approve}
            </button>
            <button disabled className="btn-quiet">
              {ui.brief.requestMore}
            </button>
            <button disabled className="btn-quiet">
              {ui.brief.turnIntoMeeting}
            </button>
          </div>
        )}
      </Reveal>
    </Stage>
  );
}
