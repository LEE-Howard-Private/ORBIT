import type { RouteId } from "./types";

/**
 * SYNCLESS decision engine.
 *
 * The model extracts factors; this file decides. Every route score is a
 * weighted sum of named factors with the weights written out below, so a
 * recommendation can always be re-derived by hand from the numbers shown
 * in the Decision Trace.
 */

export type FactorKey =
  | "information_sufficiency"
  | "stakeholder_load"
  | "stakeholder_complexity"
  | "decision_ambiguity"
  | "real_time_dependency"
  | "urgency"
  | "disagreement_potential"
  | "decision_consequence";

export interface Factors {
  /** How much of what the decision needs already exists. 0–100. */
  information_sufficiency: number;
  /** How many people must contribute. A count, not a score. */
  stakeholder_count: number;
  /** How tangled those people's interests are. 0–100. */
  stakeholder_complexity: number;
  /** How under-specified the decision is. 0–100. */
  decision_ambiguity: number;
  /** How much the resolution depends on live back-and-forth. 0–100. */
  real_time_dependency: number;
  /** How soon it must be resolved. 0–100. */
  urgency: number;
  /** How likely the parties are to disagree. 0–100. */
  disagreement_potential: number;
  /** How costly the decision is to get wrong. 0–100. */
  decision_consequence: number;
}

/** A raw headcount normalised onto the same 0–100 scale as everything else. */
export function stakeholderLoad(count: number): number {
  return Math.round(Math.min(1, Math.max(0, count) / 8) * 100);
}

export function factorValues(f: Factors): Record<FactorKey, number> {
  return {
    information_sufficiency: f.information_sufficiency,
    stakeholder_load: stakeholderLoad(f.stakeholder_count),
    stakeholder_complexity: f.stakeholder_complexity,
    decision_ambiguity: f.decision_ambiguity,
    real_time_dependency: f.real_time_dependency,
    urgency: f.urgency,
    disagreement_potential: f.disagreement_potential,
    decision_consequence: f.decision_consequence,
  };
}

/**
 * A term reads a factor one of three ways:
 *   "high"  — the higher the factor, the better this route fits
 *   "low"   — the lower the factor, the better
 *   "mid"   — the route fits best around `center` and falls off either side
 */
type Term = {
  factor: FactorKey;
  weight: number;
  shape: "high" | "low" | "mid";
  center?: number;
  width?: number;
};

export const ROUTE_WEIGHTS: Record<RouteId, Term[]> = {
  // Nobody needs to be involved: the answer exists and no one owns a judgement.
  ai_handles_it: [
    { factor: "information_sufficiency", weight: 0.28, shape: "high" },
    { factor: "stakeholder_load", weight: 0.22, shape: "low" },
    { factor: "decision_ambiguity", weight: 0.18, shape: "low" },
    { factor: "stakeholder_complexity", weight: 0.12, shape: "low" },
    { factor: "real_time_dependency", weight: 0.1, shape: "low" },
    { factor: "disagreement_potential", weight: 0.1, shape: "low" },
  ],
  // Several people hold pieces of the answer, and none of them need each other
  // in the room to hand those pieces over.
  async_first: [
    { factor: "information_sufficiency", weight: 0.24, shape: "high" },
    { factor: "real_time_dependency", weight: 0.22, shape: "low" },
    { factor: "disagreement_potential", weight: 0.16, shape: "low" },
    { factor: "stakeholder_load", weight: 0.16, shape: "mid", center: 45, width: 45 },
    { factor: "decision_ambiguity", weight: 0.14, shape: "mid", center: 35, width: 45 },
    { factor: "decision_consequence", weight: 0.08, shape: "low" },
  ],
  // The trade-off is real, contested, and expensive to get wrong.
  meeting: [
    { factor: "decision_ambiguity", weight: 0.24, shape: "high" },
    { factor: "disagreement_potential", weight: 0.24, shape: "high" },
    { factor: "real_time_dependency", weight: 0.2, shape: "high" },
    { factor: "stakeholder_complexity", weight: 0.16, shape: "high" },
    { factor: "decision_consequence", weight: 0.16, shape: "high" },
  ],
};

function termScore(value: number, term: Term): number {
  if (term.shape === "high") return value;
  if (term.shape === "low") return 100 - value;
  const center = term.center ?? 50;
  const width = term.width ?? 50;
  return Math.max(0, 100 - (Math.abs(value - center) / width) * 100);
}

export interface RouteScore {
  route: RouteId;
  score: number;
  contributions: { factor: FactorKey; weight: number; value: number; points: number }[];
}

export function scoreRoute(route: RouteId, f: Factors): RouteScore {
  const values = factorValues(f);
  const terms = ROUTE_WEIGHTS[route];
  const totalWeight = terms.reduce((sum, t) => sum + t.weight, 0);

  const contributions = terms.map((t) => {
    const value = values[t.factor];
    return {
      factor: t.factor,
      weight: t.weight,
      value,
      points: (termScore(value, t) * t.weight) / totalWeight,
    };
  });

  return {
    route,
    score: Math.round(contributions.reduce((sum, c) => sum + c.points, 0)),
    contributions,
  };
}

export interface EngineResult {
  route: RouteId;
  /** Confidence in the recommendation. Not a probability that a meeting happens. */
  confidence: number;
  /** Independent fit scores, 0–100 each. They do not sum to 100. */
  scores: Record<RouteId, number>;
  margin: number;
  runnerUp: RouteId;
}

const ROUTES: RouteId[] = ["ai_handles_it", "async_first", "meeting"];

export function decide(f: Factors): EngineResult {
  const scored = ROUTES.map((r) => scoreRoute(r, f)).sort((a, b) => b.score - a.score);
  const [best, second] = scored;
  const margin = best.score - second.score;

  // Confidence is how well the winning route fits, nudged by how clearly it won.
  const confidence = Math.round(
    Math.min(97, Math.max(45, best.score + 0.12 * margin))
  );

  return {
    route: best.route,
    confidence,
    scores: scored.reduce(
      (acc, s) => ({ ...acc, [s.route]: s.score }),
      {} as Record<RouteId, number>
    ),
    margin,
    runnerUp: second.route,
  };
}

/* ------------------------------------------------------------------ */
/* Meeting cost                                                        */
/* ------------------------------------------------------------------ */

/**
 * A demo assumption, not a measurement: the fully loaded cost of an hour of
 * one person's synchronous time. Change it here and every figure follows.
 */
export const LOADED_HOURLY_COST = 900;

export interface MeetingCost {
  participants: number;
  minutes: number;
  hours: number;
  rate: number;
  total: number;
}

export function meetingCost(
  participants: number,
  minutes: number,
  rate: number = LOADED_HOURLY_COST
): MeetingCost {
  const hours = minutes / 60;
  return {
    participants,
    minutes,
    hours,
    rate,
    total: Math.round(participants * hours * rate),
  };
}
