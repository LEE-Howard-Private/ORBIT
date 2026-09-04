import { ntd } from "./format";
import type { Analysis, RouteId, RouteOption, Scenario, Stakeholder } from "./types";

export interface LiveQuestion {
  id?: string;
  role: string;
  question: string;
  respondent_name?: string;
  respondent_title?: string;
  simulated_answer?: string;
  responded_in?: string;
  flag?: { kind: "constraint" | "conflict"; label: string; effect: string };
}

export interface LiveAnalysis extends Omit<Analysis, "questions"> {
  questions: LiveQuestion[];
  baseline?: {
    participants?: number;
    duration_minutes?: number;
    coordination_time?: string;
  };
  synthesis?: string;
}

const ROUTE_ORDER: RouteId[] = ["ai_handles_it", "async_first", "meeting"];

const ROUTE_META: Record<RouteId, { code: string; name: string; tagline: string; description: string }> = {
  ai_handles_it: {
    code: "01",
    name: "AI HANDLES IT",
    tagline: "No human input required",
    description: "SYNCLESS answers directly from existing systems and logs the decision.",
    },
  async_first: {
    code: "02",
    name: "ASYNC FIRST",
    tagline: "Collect, synthesize, decide",
    description: "SYNCLESS asks the owners directly, synthesizes the answers and drafts the decision.",
  },
  meeting: {
    code: "03",
    name: "MEETING",
    tagline: "Synchronous time required",
    description: "Escalate to a live session when disagreement is real and unresolved.",
  },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Turns a live LLM analysis into the same Scenario shape the offline demo uses,
 * so every screen renders identically for canned and live runs.
 */
export function buildScenarioFromAnalysis(request: string, a: LiveAnalysis): Scenario {
  const beforeParticipants = Math.max(2, Math.round(a.baseline?.participants ?? 8));
  const beforeDuration = Math.max(15, Math.round(a.baseline?.duration_minutes ?? 60));
  const afterParticipants = Math.max(1, a.recommended_participants.length || 3);
  const afterDuration = Math.max(5, Math.round(a.recommended_duration || 20));

  const beforeCost = Math.max(0, Math.round(a.estimated_cost));
  const afterCost = roundTo(
    (beforeCost * (afterParticipants * afterDuration)) / (beforeParticipants * beforeDuration),
    50
  );
  const saving = Math.max(0, beforeCost - afterCost);

  const stakeholders: Stakeholder[] = a.questions.map((q, i) => {
    const name = q.respondent_name?.trim() || `${q.role} Lead`;
    return {
      id: q.id || `q-${i}`,
      role: q.role,
      name,
      title: q.respondent_title?.trim() || `${q.role} Owner`,
      initials: initials(name),
      question: q.question,
      answer:
        q.simulated_answer?.trim() ||
        "Response collected asynchronously and folded into the decision brief.",
      respondedIn: q.responded_in?.trim() || `${12 + i * 14} min`,
      channel: i % 2 === 0 ? "Slack DM" : "Email",
      flag: q.flag,
    };
  });

  const routes: RouteOption[] = ROUTE_ORDER.map((id) => {
    const meta = ROUTE_META[id];
    const selected = id === a.route;
    const base: RouteOption = {
      id,
      code: meta.code,
      name: meta.name,
      tagline: meta.tagline,
      description: meta.description,
      signals: [],
    };

    if (id === "ai_handles_it") {
      base.notesTitle = "Blocked on";
      base.notes = a.questions
        .slice(0, 3)
        .map((q) => `${q.role} — needs an accountable answer, not a system lookup`);
      base.signals = [
        { label: "Human input needed", value: a.questions.length > 0 ? "Yes" : "No" },
        { label: "Accountable owner", value: a.decision?.owner ? "Required" : "Optional" },
        { label: "Fit score", value: `${Math.max(0, 100 - a.information_sufficiency - 6)}%` },
      ];
    } else if (id === "async_first") {
      base.notesTitle = "Questions to dispatch";
      base.notes = a.questions.map((q) => `${q.role} — ${q.question}`);
      base.signals = [
        { label: "Owners contacted", value: String(a.questions.length) },
        { label: "Human time", value: `${afterDuration} min` },
        { label: "Fit score", value: `${a.confidence}%` },
      ];
    } else {
      base.signals = [
        { label: "Participants", value: String(beforeParticipants) },
        { label: "Duration", value: `${beforeDuration} min` },
        { label: "Fit score", value: `${a.necessity_score}%` },
      ];
      base.preview = {
        participants: Array.from(
          { length: beforeParticipants },
          (_, i) => a.recommended_participants[i] || `Participant ${i + 1}`
        ),
        duration: `${beforeDuration} minutes`,
        earliestSlot: a.baseline?.coordination_time || "Earliest common slot: 3 days out",
        decisionGoal: a.decision?.title || "Reach a decision on the request",
        cost: beforeCost,
      };
    }

    if (selected) {
      base.selectedBecause = `Necessity ${a.necessity_score}% with ${a.information_sufficiency}% information sufficiency — SYNCLESS routed this request here.`;
    } else {
      base.rejectedBecause =
        id === "meeting"
          ? `Necessity ${a.necessity_score}% sits below the 60% threshold for synchronous escalation.`
          : "This request still needs named human accountability before it can be closed.";
    }
    return base;
  });

  return {
    id: "live-request",
    title: a.decision?.title || "Live Request",
    org: "Your organization",
    requester: { name: "You", role: "Requester", initials: "YU" },
    submittedAt: "Just now",
    request,
    before: {
      chain: [
        "Request",
        "Slack coordination",
        "Calendar scheduling",
        `${beforeParticipants} people invited`,
        `${beforeDuration}-minute meeting`,
        "Discussion",
        "Decision",
      ],
      cost: [
        { label: "Participants", value: String(beforeParticipants) },
        { label: "Meeting length", value: `${beforeDuration} min` },
        { label: "Coordination cost", value: ntd(beforeCost) },
        { label: "Time to decision", value: a.baseline?.coordination_time || "Multi-day" },
      ],
      verdict:
        "The request becomes a meeting before anyone checks whether the answers already exist.",
    },
    intro: {
      headline: "Meetings are not the problem.",
      subhead: "Synchronization is.",
      lines: [
        "Every request becomes a calendar negotiation before anyone decides anything.",
        `${beforeParticipants} people. ${beforeDuration} minutes. ${ntd(beforeCost)} of synchronous time.`,
        "SYNCLESS routes the request instead of scheduling it.",
      ],
    },
    analysis: {
      route: a.route,
      necessity_score: a.necessity_score,
      information_sufficiency: a.information_sufficiency,
      reasoning: a.reasoning,
      estimated_cost: beforeCost,
      headline: a.headline,
      factors: a.factors,
      meeting: a.meeting,
      decision_complexity: a.decision_complexity,
      realtime_discussion: a.realtime_discussion,
      stakeholder_conflict: a.stakeholder_conflict,
      information_sources: a.information_sources,
      cost_basis:
        a.cost_basis ||
        `${beforeParticipants} participants × ${beforeDuration} min = ${ntd(beforeCost)}`,
      recommended_participants: a.recommended_participants,
      recommended_duration: afterDuration,
      questions: a.questions.map((q, i) => ({
        id: q.id || `q-${i}`,
        role: q.role,
        question: q.question,
      })),
      decision: a.decision,
      confidence: a.confidence,
    },
    routes,
    stakeholders,
    routeLocked: {
      label: a.route === "meeting" ? "Meeting compressed" : "Meeting avoided",
      value: a.route === "meeting" ? `${ntd(saving)} saved` : ntd(beforeCost),
      caption:
        a.route === "meeting"
          ? `${beforeParticipants} → ${afterParticipants} people · positions collected before anyone meets`
          : `${a.questions.length} questions dispatched to named owners · no calendar invite created`,
    },
    synthesis:
      a.synthesis ||
      `${stakeholders.length} of ${stakeholders.length} responses collected. No conflicts detected — the brief below is ready for approval.`,
    roi: {
      headline:
        a.route === "meeting"
          ? `We turned a ${beforeDuration}-minute meeting into a ${afterDuration}-minute decision.`
          : `We turned a ${beforeDuration}-minute coordination meeting into a ${afterDuration}-minute decision review.`,
      rows: [
        { metric: "Participants", before: String(beforeParticipants), after: String(afterParticipants) },
        {
          metric: "Duration",
          before: `${beforeDuration}-minute meeting`,
          after: `${afterDuration}-minute review`,
        },
        { metric: "Cost", before: ntd(beforeCost), after: ntd(afterCost) },
        {
          metric: "Coordination time",
          before: a.baseline?.coordination_time || "Multi-day coordination",
          after: "Same-day decision",
        },
      ],
      savingLabel: "Estimated saving",
      saving: ntd(saving),
      savingAmount: saving,
      footnote: "One request. Every quarter, every team, every recurring sync.",
    },
    closing: {
      statement: "We don't manage meetings. We eliminate the meetings your company never needed.",
      wordmark: "SYNCLESS",
      positioning: "AI Decision Layer for Modern Teams",
    },
  };
}
