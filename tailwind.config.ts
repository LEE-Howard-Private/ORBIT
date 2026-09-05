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
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        cine: "cubic-bezier(0.22, 1, 0.36, 1)",
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
          "0%,100%": { opacity: "0.35" },
          "50%": { opacity: "0.8" },
        },
        sweepIn: {
          "0%": { opacity: "0", transform: "translateY(10px)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
      },
      animation: {
        driftA: "driftA 34s cubic-bezier(0.4,0,0.2,1) infinite",
        driftB: "driftB 46s cubic-bezier(0.4,0,0.2,1) infinite",
        breathe: "breathe 2.4s ease-in-out infinite",
        sweepIn: "sweepIn 700ms cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
