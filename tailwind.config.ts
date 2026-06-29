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
        background: "#F7F4F0",
        foreground: "#000000",
        accent: "#000000",
        border: "#E8E4DF",
        footerBg: "#E7DED3",
        whiteAlt: "#000000",
      },
      fontFamily: {
        cormorant: ["Optima", "sans-serif"],
        sans: ["Optima", "sans-serif"],
        baskerville: ["\"Fry's Baskerville\"", "serif"],
        optima: ["Optima", "sans-serif"],
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
