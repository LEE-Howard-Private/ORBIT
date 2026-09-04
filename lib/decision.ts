import { decide, meetingCost, type EngineResult, type MeetingCost } from "./engine";
import type { Scenario } from "./types";

export interface DecisionView {
  engine: EngineResult | null;
  cost: MeetingCost | null;
}

/**
 * The single place the UI asks "what did the engine decide?".
 * Scenarios carry factors; the route and confidence are always computed.
 */
export function readDecision(scenario: Scenario): DecisionView {
  const f = scenario.analysis.factors;
  const m = scenario.analysis.meeting;
  return {
    engine: f ? decide(f) : null,
    cost: m ? meetingCost(m.participants, m.minutes) : null,
  };
}
