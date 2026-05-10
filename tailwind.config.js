/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  ["./App.{js,ts,tsx}", "./src/**/*.{js,ts,tsx}"],
  presets:  [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        // Dark mode surfaces
        surface: {
          primary:   "#0a0a0a",
          secondary: "#141414",
          tertiary:  "#1f1f1f",
          card:      "#1a1a1a",
          border:    "#2a2a2a",
        },
        // Light mode surfaces
        light: {
          primary:   "#f9fafb",
          secondary: "#ffffff",
          tertiary:  "#f3f4f6",
          card:      "#ffffff",
          border:    "#e5e7eb",
        },
      },
      fontSize: {
        xs:   ["13px", { lineHeight: "18px" }],
        sm:   ["15px", { lineHeight: "22px" }],
        base: ["17px", { lineHeight: "26px" }],
        lg:   ["19px", { lineHeight: "28px" }],
        xl:   ["21px", { lineHeight: "30px" }],
        "2xl":["24px", { lineHeight: "32px" }],
        "3xl":["30px", { lineHeight: "38px" }],
        "4xl":["36px", { lineHeight: "44px" }],
      },
    },
  },
  plugins: [],
};
