/** State is carried by a 7px dot, never by a filled block of colour. */
export type DotState = "idle" | "active" | "done" | "alert" | "accent";

// literal class names, so Tailwind never purges them
const CLASS: Record<DotState, string> = {
  idle: "dot dot-idle",
  active: "dot dot-active",
  done: "dot dot-done",
  alert: "dot dot-alert",
  accent: "dot dot-accent",
};

export function Dot({ state = "idle", className = "" }: { state?: DotState; className?: string }) {
  return <span className={`${CLASS[state]} ${className}`} aria-hidden />;
}
