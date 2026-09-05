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
          ? "flex min-h-[100svh] flex-col justify-center pb-28 pt-28"
          : "pb-32 pt-28 md:pt-32"
      }`}
    >
      {eyebrow ? <div className="eyebrow mb-8">{eyebrow}</div> : null}
      {children}
    </div>
  );
}
