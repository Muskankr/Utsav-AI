import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FDFAF6",
          100: "#FAF6F0",
          200: "#F4EDE2",
          300: "#ECE2D0",
          400: "#DECDB6",
          500: "#CEB596",
        },
        indigo: {
          900: "#1E1B4B",
          950: "#0F0E2A",
        },
        coral: {
          50: "#FFF5F5",
          100: "#FFE6E6",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        festive: {
          gold: "#D97706",
          goldLight: "#FEF3C7",
          maroon: "#881337",
          saffron: "#EA580C",
          emerald: "#047857",
        }
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-playfair)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 24px -2px rgba(30, 27, 75, 0.06), 0 2px 8px -2px rgba(30, 27, 75, 0.04)",
        card: "0 10px 30px -4px rgba(30, 27, 75, 0.08), 0 4px 12px -2px rgba(30, 27, 75, 0.03)",
        elevated: "0 20px 40px -10px rgba(30, 27, 75, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

