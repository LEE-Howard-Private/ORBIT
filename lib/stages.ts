import type { Scenario, StageId } from "./types";

/** The whole narrative, in order. Back / Next walks this. */
export const SEQUENCE: StageId[] = [
  "intro",
  "montage",
  "request",
  "analysis",
  "route",
  "async",
  "brief",
  "roi",
  "closing",
];

/** The six named screens the rail exposes; several stages fold into one tick. */
export const RAIL_STAGES: StageId[] = ["request", "analysis", "route", "async", "brief", "roi"];

export function railIndex(stage: StageId): number {
  switch (stage) {
    case "intro":
    case "montage":
    case "request":
      return 0;
    case "analysis":
      return 1;
    case "route":
      return 2;
    case "async":
      return 3;
    case "brief":
      return 4;
    case "roi":
    case "closing":
      return 5;
  }
}

/** Highest step index a stage can reach — used when a screen is opened by hand. */
export function maxStep(stage: StageId, scenario: Scenario): number {
  const n = scenario.stakeholders.length;
  switch (stage) {
    case "intro":
      return 3;
    case "montage":
      return 4;
    case "request":
      return 2;
    case "analysis":
      return 5;
    case "route":
      return 3;
    case "async":
      return 1 + n * 2;
    case "brief":
      return 2;
    case "roi":
      return 2;
    case "closing":
      return 1;
  }
}

/** Where a stage lands when opened by hand: fully revealed, still interactive. */
export function restingStep(stage: StageId, scenario: Scenario): number {
  if (stage === "request") return 0;
  if (stage === "brief") return 1;
  return maxStep(stage, scenario);
}
