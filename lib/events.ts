export type OrbitEvent =
  | "analysisStarted"
  | "analysisStepCompleted"
  | "routeDetermined"
  | "asyncStarted"
  | "responseReceived"
  | "decisionReady";

type Handler = (event: OrbitEvent, detail?: Record<string, unknown>) => void;

const handlers = new Set<Handler>();

/**
 * Named moments in the flow. Nothing is attached by default — the product is
 * fully usable in silence — but a cinematic build can subscribe and play a
 * cue without any screen knowing about audio.
 */
export function onOrbit(handler: Handler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function emit(event: OrbitEvent, detail?: Record<string, unknown>): void {
  handlers.forEach((h) => {
    try {
      h(event, detail);
    } catch {
      /* a listener must never break the flow */
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`orbit:${event}`, { detail }));
  }
}
