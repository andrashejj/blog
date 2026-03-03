import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f6f7fb",
        surface: "#ffffff",
        text: "#16181d",
        muted: "#586079",
        border: "#e5e9f2",
        brand: "#0b69ff",
        "brand-strong": "#0852c9",
      },
      boxShadow: {
        soft: "0 14px 36px rgba(22, 24, 29, 0.08)",
        card: "0 6px 20px rgba(22, 24, 29, 0.05)",
      },
      borderRadius: {
        soft: "16px",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};
