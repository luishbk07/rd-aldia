/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003366",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#C8102E",
          foreground: "#FFFFFF",
        },
        gold: {
          DEFAULT: "#FFD700",
          foreground: "#003366",
        },
        background: "#F8F9FA",
        rd: {
          blue: "#003366",
          red: "#C8102E",
          gold: "#FFD700",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "ui-sans-serif", "sans-serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "sans-serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 51, 102, 0.06), 0 8px 24px rgba(0, 51, 102, 0.06)",
        "card-hover":
          "0 8px 28px rgba(0, 51, 102, 0.12), 0 0 0 1px rgba(0, 51, 102, 0.06)",
      },
    },
  },
};
