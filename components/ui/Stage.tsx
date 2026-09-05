import type { ReactNode } from "react";

/** Every screen sits in the same column with the same vertical rhythm. */
export function Stage({
  eyebrow,
  children,
  center = false,
  wide = false,
}: {
  eyebrow?: ReactNode;
  children: ReactNode;
  center?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 md:px-10 ${wide ? "max-w-[1120px]" : "max-w-[920px]"} ${
        center
          ? "flex min-h-[var(--screen-h)] flex-col justify-center pb-36 pt-24"
          : "pb-40 pt-24 md:pt-28"
      }`}
    >
      {eyebrow ? <div className="eyebrow mb-8">{eyebrow}</div> : null}
      {children}
    </div>
  );
}
