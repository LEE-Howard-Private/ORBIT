export function ntd(amount: number): string {
  return "NT$" + Math.round(amount).toLocaleString("en-US");
}

export function pct(value: number): string {
  return `${Math.round(value)}%`;
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}
