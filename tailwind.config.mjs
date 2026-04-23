import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f1e6cf",
        "paper-deep": "#e8d9b8",
        surface: "#fbf4e2",
        ink: "#1b1713",
        "ink-soft": "#3b332b",
        muted: "#6f5f4f",
        rule: "#c8b694",
        "rule-soft": "#d9c9a6",
        terracotta: "#bf4024",
        "terracotta-strong": "#8f2c18",
        pine: "#0e4140",
        "pine-soft": "#1b5f5c",
        ochre: "#c4892d",
        ocean: "#1a2940",

        /* back-compat aliases */
        bg: "#f1e6cf",
        text: "#1b1713",
        border: "#c8b694",
        brand: "#bf4024",
        "brand-strong": "#8f2c18",
      },
      boxShadow: {
        soft: "0 1px 0 #c8b694, 0 18px 40px -22px rgba(27, 23, 19, 0.35)",
        card: "0 1px 0 #c8b694, 0 10px 24px -18px rgba(27, 23, 19, 0.30)",
      },
      borderRadius: {
        soft: "6px",
      },
      fontFamily: {
        display: ["Fraunces", "Iowan Old Style", "Palatino", "serif"],
        sans: ["Newsreader", "Iowan Old Style", "Georgia", "serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [typography],
};
