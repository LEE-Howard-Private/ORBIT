export type RouteId = "ai_handles_it" | "async_first" | "meeting";

export interface AnalysisQuestion {
  id: string;
  role: string;
  question: string;
}

export interface DecisionField {
  label: string;
  value: string;
  source: string;
}

import type { Factors } from "./engine";

export interface InfoSource {
  label: string;
  status: "available" | "partial" | "missing";
  detail?: string;
}

export interface MeetingBrief {
  objective: string;
  decisions: string[];
  participants: string[];
  preread: string[];
  questions: string[];
}

export interface Decision {
  title: string;
  recommendation: string;
  /** e.g. "Decision Ready" — the state the brief hands back to the user. */
  status?: string;
  /** What SYNCLESS does the moment the brief is approved — closes the loop. */
  post_approval?: string[];
  /** Present when the route is MEETING: what the room is for. */
  meeting_brief?: MeetingBrief;
  launch_date: string;
  product_status: string;
  constraint: string;
  owner: string;
  fields: DecisionField[];
}

/** The contract every analysis — canned or live — is normalized into. */
export interface Analysis {
  route: RouteId;
  necessity_score: number;
  information_sufficiency: number;
  reasoning: string[];
  estimated_cost: number;
  /** The extracted factors the decision engine scores. */
  factors?: Factors;
  /** The meeting that was requested, for the transparent cost calculation. */
  meeting?: { participants: number; minutes: number };
  /** Shown as the arithmetic behind estimated_cost, so the price is checkable. */
  cost_basis?: string;
  /** Why this route was chosen, in one sentence, above the detailed reasoning. */
  headline?: string;
  decision_complexity?: "Low" | "Medium" | "High";
  realtime_discussion?: string;
  stakeholder_conflict?: string;
  information_sources?: InfoSource[];
  recommended_participants: string[];
  recommended_duration: number;
  questions: AnalysisQuestion[];
  decision: Decision;
  confidence: number;
}

export interface RouteSignal {
  label: string;
  value: string;
}

export interface MeetingPreview {
  participants: string[];
  duration: string;
  earliestSlot: string;
  decisionGoal: string;
  cost: number;
}

export interface RouteOption {
  id: RouteId;
  code: string;
  name: string;
  tagline: string;
  description: string;
  selectedBecause?: string;
  rejectedBecause?: string;
  signals: RouteSignal[];
  notesTitle?: string;
  notes?: string[];
  preview?: MeetingPreview;
}

export interface Stakeholder {
  id: string;
  role: string;
  name: string;
  title: string;
  initials: string;
  question: string;
  answer: string;
  respondedIn: string;
  channel: string;
  /** Raised when a reply introduces a constraint or contradicts another reply. */
  flag?: { kind: "constraint" | "conflict"; label: string; effect: string };
}

export interface RoiRow {
  metric: string;
  before: string;
  after: string;
}

export interface Scenario {
  id: string;
  title: string;
  /** One-line label for the scenario picker. */
  summary?: string;
  /** Condensed request used by the routing montage. */
  shortRequest?: string;
  org: string;
  requester: { name: string; role: string; initials: string };
  submittedAt: string;
  request: string;
  intro: { headline: string; subhead: string; lines: string[] };
  /** The workflow this request would have triggered without SYNCLESS. */
  before: {
    chain: string[];
    cost: { label: string; value: string }[];
    verdict: string;
    note?: string;
  };
  analysis: Analysis;
  routes: RouteOption[];
  stakeholders: Stakeholder[];
  synthesis: string;
  /** Per-scenario coordination ledger on screen 04; falls back to computed rows. */
  ledger?: { label: string; value: string }[];
  /** Banner shown once the route is locked on screen 03. */
  routeLocked?: { label: string; value: string; caption: string };
  roi: {
    /** The primary message. The saving is supporting evidence, not the headline. */
    headline: string;
    /** The one transformation the result reduces to. */
    transform?: { from: string; to: string };
    rows: RoiRow[];
    savingLabel: string;
    saving: string;
    savingAmount: number;
    footnote: string;
  };
  closing: { statement: string; wordmark: string; positioning: string };
}

export type StageId =
  | "intro"
  | "montage"
  | "request"
  | "analysis"
  | "route"
  | "async"
  | "brief"
  | "roi"
  | "closing";

export interface ScriptStep {
  stage: StageId;
  step: number;
  /** Milliseconds this beat holds before the next one fires, at 1x speed. */
  hold: number;
}
