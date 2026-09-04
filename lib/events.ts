export type SynclessEvent =
  | "analysisStarted"
  | "analysisStepCompleted"
  | "routeDetermined"
  | "asyncStarted"
  | "responseReceived"
  | "decisionReady";

type Handler = (event: SynclessEvent, detail?: Record<string, unknown>) => void;

const handlers = new Set<Handler>();

/**
 * Named moments in the flow. Nothing is attached by default — the product is
 * fully usable in silence — but a cinematic build can subscribe and play a
 * cue without any screen knowing about audio.
 */
export function onSyncless(handler: Handler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function emit(event: SynclessEvent, detail?: Record<string, unknown>): void {
  handlers.forEach((h) => {
    try {
      h(event, detail);
    } catch {
      /* a listener must never break the flow */
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`syncless:${event}`, { detail }));
  }
}
