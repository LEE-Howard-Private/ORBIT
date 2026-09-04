/* One icon language: 1.4px strokes, round joins, 16px box, no fills. */

type P = { className?: string };
const base = "h-4 w-4";

function S({ className = base, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: P) => (
  <S {...p}>
    <path d="M4 10h11M11 5.8 15.2 10 11 14.2" />
  </S>
);

export const ArrowUp = (p: P) => (
  <S {...p}>
    <path d="M10 15.5V5M5.8 9.2 10 5l4.2 4.2" />
  </S>
);

export const Check = (p: P) => (
  <S {...p}>
    <path d="M4.5 10.4 8 13.9l7.5-8" />
  </S>
);

export const Dot = ({ className = base }: P) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <circle cx="10" cy="10" r="2.4" />
  </svg>
);

export const Ring = (p: P) => (
  <S {...p}>
    <circle cx="10" cy="10" r="5.2" />
  </S>
);

export const Chevron = (p: P) => (
  <S {...p}>
    <path d="M6.5 8.2 10 11.8l3.5-3.6" />
  </S>
);

export const Play = ({ className = base }: P) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M6.6 4.6 15.4 10l-8.8 5.4z" />
  </svg>
);

export const Pause = ({ className = base }: P) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <rect x="6" y="5" width="3" height="10" rx="1" />
    <rect x="11" y="5" width="3" height="10" rx="1" />
  </svg>
);

export const Search = (p: P) => (
  <S {...p}>
    <circle cx="9" cy="9" r="4.4" />
    <path d="M12.4 12.4 15.8 15.8" />
  </S>
);

export const Spark = (p: P) => (
  <S {...p}>
    <path d="M10 3.4 11.5 8 16 9.6 11.5 11.2 10 15.8 8.5 11.2 4 9.6 8.5 8z" />
  </S>
);

export const Alert = (p: P) => (
  <S {...p}>
    <path d="M10 4.2 16.6 15.4H3.4z" />
    <path d="M10 8.6v3" />
    <path d="M10 13.4h.01" />
  </S>
);

export const Mark = ({ className = "h-4 w-4" }: P) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="4.4" cy="10" r="1.9" fill="currentColor" />
    <circle cx="15.6" cy="5.2" r="1.5" fill="currentColor" opacity="0.55" />
    <circle cx="15.6" cy="14.8" r="1.5" fill="currentColor" opacity="0.55" />
    <path
      d="M6.1 9.2 13.9 5.8M6.1 10.8l7.8 3.4"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      opacity="0.45"
    />
  </svg>
);

export const Spinner = ({ className = base }: P) => (
  <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.6" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
