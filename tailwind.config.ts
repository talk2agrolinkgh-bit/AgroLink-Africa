import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1F4E2B",
          50: "#EAF1EA",
          100: "#CFE0D0",
          600: "#1F4E2B",
          700: "#193F22",
          800: "#122E19",
          900: "#0C2012",
        },
        gold: {
          DEFAULT: "#C98A2B",
          100: "#F3E1BE",
          200: "#EACD93",
          600: "#C98A2B",
          700: "#A66E1C",
        },
        cream: {
          DEFAULT: "#F3ECDC",
          50: "#FAF7EF",
          100: "#F3ECDC",
          200: "#E9DFC6",
        },
        ink: {
          DEFAULT: "#16241A",
          soft: "#41503F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
