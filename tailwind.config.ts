import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        parchment: "var(--parchment)",
        sand: "var(--sand)",
        terracotta: "var(--terracotta)",
        rust: "var(--rust)",
        sienna: "var(--sienna)",
        ink: "var(--ink)",
        warmGray: "var(--warm-gray)",
        sage: "var(--sage)",
      },
      borderRadius: {
        soft: "6px",
        card: "10px",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
