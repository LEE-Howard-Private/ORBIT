import type { EngineResult, MeetingCost } from "./engine";
import { ntd } from "./format";
import type { UIStrings } from "./i18n";
import { SEQUENCE } from "./stages";
import type { RouteId, Scenario, StageId } from "./types";

export interface NarratorLine {
  id: string;
  text?: string;
  /** A one-word system status, shown as a label rather than prose. */
  status?: string;
  items?: string[];
  metrics?: { label: string; value: string }[];
  /** Renders the verdict block. */
  route?: RouteId;
  emphasis?: boolean;
}

interface Beat {
  stage: StageId;
  step: number;
  line: NarratorLine;
}

const at = (stage: StageId, step: number, line: NarratorLine): Beat => ({ stage, step, line });

/**
 * The narrator is derived, never authored: every line is a function of the
 * stage machine's real position and the engine's real output, so it cannot
 * describe something the product is not doing.
 */
export function narrate(
  scenario: Scenario,
  stage: StageId,
  step: number,
  ui: UIStrings,
  engine: EngineResult | null,
  cost: MeetingCost | null
): NarratorLine[] {
  const n = ui.narrator;
  const a = scenario.analysis;
  const people = scenario.stakeholders;
  const count = people.length;
  const contributors = a.factors?.stakeholder_count ?? count;
  const route: RouteId = engine?.route ?? a.route;
  const beats: Beat[] = [];

  /* the request */
  beats.push(at("request", 1, { id: "received", text: n.received }));
  beats.push(at("request", 2, { id: "breaking", text: n.breaking }));

  /* the analysis, one beat per engine step */
  beats.push(
    at("analysis", 0, { id: "understanding", text: n.understanding, status: n.statusUnderstanding })
  );
  beats.push(
    at("analysis", 1, {
      id: "stakeholders",
      text: contributors > 0 ? n.stakeholders(contributors) : n.noStakeholders,
      items: people.map((p) => p.role),
    })
  );
  beats.push(
    at("analysis", 2, {
      id: "constraints",
      text: n.constraints(a.constraints?.length ?? 0),
      items: a.constraints,
    })
  );
  beats.push(
    at("analysis", 3, {
      id: "gaps",
      text: n.gaps(a.questions.length),
      metrics: [
        { label: n.infoAvailable, value: `${a.information_sufficiency}%` },
        { label: n.evidenceFound, value: n.sources(a.information_sources?.length ?? count) },
      ],
    })
  );
  beats.push(
    at("analysis", 4, {
      id: "realtime",
      text: contributors > 0 ? n.realtime : n.realtimeNone,
      emphasis: true,
    })
  );
  if (cost) {
    beats.push(at("analysis", 4, { id: "cost", text: n.cost(ntd(cost.total)) }));
  }
  beats.push(at("analysis", 5, { id: "ready", text: n.ready }));

  /* the verdict */
  beats.push(at("route", 3, { id: "why", text: n.routeWhy[route] }));
  beats.push(at("route", 3, { id: "verdict", route }));
  if (route === "meeting" && a.factors) {
    beats.push(
      at("route", 3, {
        id: "meeting-reasons",
        text: n.meetingReasons,
        items: [
          `${ui.trace.factorNames.decision_ambiguity} ${a.factors.decision_ambiguity}`,
          `${ui.trace.factorNames.disagreement_potential} ${a.factors.disagreement_potential}`,
          `${ui.trace.factorNames.decision_consequence} ${a.factors.decision_consequence}`,
        ],
      })
    );
    beats.push(at("route", 3, { id: "meeting-prepared", text: n.meetingPrepared }));
  }

  /* the coordination */
  if (count > 0) {
    beats.push(
      at("async", 0, {
        id: "async-selected",
        text: n.asyncSelected,
        items: a.questions.map((q) => `${q.role} → ${q.topic ?? q.question}`),
      })
    );
    beats.push(at("async", 1, { id: "async-sent", text: `${n.sent(count)} ${n.asyncIndependent}` }));
    people.forEach((person, i) => {
      beats.push(
        at("async", 1 + count + i, {
          id: `reply-${person.id}`,
          text: n.responded(person.name),
        })
      );
      if (person.flag?.kind === "conflict") {
        beats.push(
          at("async", 1 + count + i, { id: `conflict-${person.id}`, text: n.conflict, emphasis: true })
        );
      }
    });
    beats.push(at("async", 1 + count * 2, { id: "enough", text: n.enough }));
  }

  /* the decision */
  beats.push(at("brief", 1, { id: "brief-ready", text: n.briefReady }));
  beats.push(at("brief", 2, { id: "approved", text: n.approved(a.decision.owner) }));
  beats.push(at("roi", 2, { id: "saved", text: n.saved(scenario.roi.saving) }));

  const here = SEQUENCE.indexOf(stage);
  return beats
    .filter((b) => {
      const there = SEQUENCE.indexOf(b.stage);
      return there < here || (there === here && b.step <= step);
    })
    .map((b) => b.line);
}
