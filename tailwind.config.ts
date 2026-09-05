import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        void: "var(--void)",
        surface1: "var(--surface-1)",
        surface2: "var(--surface-2)",
        surface3: "var(--surface-3)",
        line: "var(--line)",
        lineStrong: "var(--line-strong)",
        fg: "var(--text)",
        fg2: "var(--text-2)",
        fg3: "var(--text-3)",
        fg4: "var(--text-4)",
        accent: "var(--accent)",
        accentQuiet: "var(--accent-quiet)",
        accentLine: "var(--accent-line)",
        accentText: "var(--accent-text)",
        stIdle: "var(--st-idle)",
        stActive: "var(--st-active)",
        stDone: "var(--st-done)",
        stAlert: "var(--st-alert)",
      },
      borderColor: {
        DEFAULT: "var(--line)",
      },
      borderRadius: {
        sm2: "var(--r-sm)",
        md2: "var(--r-md)",
        lg2: "var(--r-lg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        cine: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        driftA: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(3%,-4%,0) scale(1.08)" },
        },
        driftB: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-4%,3%,0) scale(1)" },
        },
        breathe: {
          "0%,100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        sweepIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        driftA: "driftA 34s cubic-bezier(0.4,0,0.2,1) infinite",
        driftB: "driftB 46s cubic-bezier(0.4,0,0.2,1) infinite",
        breathe: "breathe 2.4s ease-in-out infinite",
        sweepIn: "sweepIn 760ms cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
