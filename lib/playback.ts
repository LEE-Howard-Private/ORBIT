import type { Scenario, ScriptStep } from "./types";

/**
 * Decision Playback — the short film.
 *
 * Ten named states, ~30 seconds, every beat pinned to a real position in the
 * stage machine. It is a second route through the same product, not a second
 * product: nothing here can show a state the app is not actually in.
 */
export const PLAY_STATES = [
  "request",
  "understand",
  "stakeholders",
  "constraints",
  "gaps",
  "route",
  "questions",
  "responses",
  "decision",
  "impact",
] as const;

export type PlayStateId = (typeof PLAY_STATES)[number];

export function buildPlayback(scenario: Scenario): ScriptStep[] {
  const n = scenario.stakeholders.length;

  const beats: ScriptStep[] = [
    { state: "request", stage: "request", step: 1, hold: 2000 },
    { state: "understand", stage: "analysis", step: 0, hold: 3000 },
    { state: "stakeholders", stage: "analysis", step: 1, hold: 3000 },
    { state: "constraints", stage: "analysis", step: 2, hold: 3000 },
    { state: "gaps", stage: "analysis", step: 3, hold: 3000 },
    { state: "route", stage: "route", step: 3, hold: 3400 },
  ];

  if (n > 0) {
    beats.push({ state: "questions", stage: "async", step: n, hold: 3000 });
    beats.push({ state: "responses", stage: "async", step: 1 + n * 2, hold: 3000 });
  }

  beats.push({ state: "decision", stage: "brief", step: 1, hold: 4000 });
  beats.push({ state: "impact", stage: "roi", step: 2, hold: 3400 });

  return beats;
}

export function playbackLength(scenario: Scenario): number {
  return buildPlayback(scenario).length;
}
