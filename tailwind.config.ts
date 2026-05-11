import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        foreground: "#1A1A1A",
        accent: "#C9A96E",
        border: "#E8E4DF",
        footerBg: "#1A1A1A",
        whiteAlt: "#FAF8F5",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)"],
        sans: ["var(--font-dm-sans)"],
      },
      keyframes: {
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        kenBurns: "kenBurns 8s linear forwards",
        pulseLine: "pulseLine 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        slowEase: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
