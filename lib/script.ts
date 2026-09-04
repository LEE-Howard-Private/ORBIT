import type { Scenario, ScriptStep } from "./types";

/**
 * The Golden Path timeline used by "Play Full Demo".
 * Beats are tuned for screen recording: every number lands, then holds
 * long enough to be read out loud before the next beat fires.
 */
export function buildScript(scenario: Scenario): ScriptStep[] {
  const s: ScriptStep[] = [];
  const n = scenario.stakeholders.length;

  // Act I — the coordination-cost problem
  s.push({ stage: "intro", step: 0, hold: 2400 });
  s.push({ stage: "intro", step: 1, hold: 2400 });
  s.push({ stage: "intro", step: 2, hold: 2600 });
  s.push({ stage: "intro", step: 3, hold: 2800 });

  // Act II — proof that it routes: three requests, three different verdicts
  s.push({ stage: "montage", step: 0, hold: 1900 });
  s.push({ stage: "montage", step: 1, hold: 1600 });
  s.push({ stage: "montage", step: 2, hold: 1600 });
  s.push({ stage: "montage", step: 3, hold: 2000 });
  s.push({ stage: "montage", step: 4, hold: 2600 });

  // Act III — the CEO files a request
  s.push({ stage: "request", step: 0, hold: 1000 });
  s.push({ stage: "request", step: 1, hold: 3600 });
  s.push({ stage: "request", step: 2, hold: 1800 });

  // Act IV — decision analysis, metric by metric
  s.push({ stage: "analysis", step: 0, hold: 1400 });
  s.push({ stage: "analysis", step: 1, hold: 1700 });
  s.push({ stage: "analysis", step: 2, hold: 1800 });
  s.push({ stage: "analysis", step: 3, hold: 1700 });
  s.push({ stage: "analysis", step: 4, hold: 3200 });
  s.push({ stage: "analysis", step: 5, hold: 2600 });

  // Act V — three routes, one selected
  s.push({ stage: "route", step: 0, hold: 1500 });
  s.push({ stage: "route", step: 1, hold: 1400 });
  s.push({ stage: "route", step: 2, hold: 1400 });
  s.push({ stage: "route", step: 3, hold: 3000 });

  // Act VI — async coordination, question by question, reply by reply
  s.push({ stage: "async", step: 0, hold: 1800 });
  for (let i = 0; i < n; i++) s.push({ stage: "async", step: 1 + i, hold: 1100 });
  for (let i = 0; i < n; i++) s.push({ stage: "async", step: 1 + n + i, hold: 1400 });
  s.push({ stage: "async", step: 1 + n * 2, hold: 2800 });

  // Act VII — the brief, and the approval
  s.push({ stage: "brief", step: 0, hold: 1600 });
  s.push({ stage: "brief", step: 1, hold: 3800 });
  s.push({ stage: "brief", step: 2, hold: 2400 });

  // Act VIII — what it was worth
  s.push({ stage: "roi", step: 0, hold: 2200 });
  s.push({ stage: "roi", step: 1, hold: 2400 });
  s.push({ stage: "roi", step: 2, hold: 3600 });

  // Act IX — the line
  s.push({ stage: "closing", step: 0, hold: 2200 });
  s.push({ stage: "closing", step: 1, hold: 5000 });

  return s;
}

export function scriptDurationMs(script: ScriptStep[]): number {
  return script.reduce((sum, beat) => sum + beat.hold, 0);
}
