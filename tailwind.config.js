/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}", "./src/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#4ade80",
          500: "#22c55e",
          900: "#14532d",
        },
        surface: {
          primary: "#0a0a0a",
          secondary: "#141414",
          tertiary: "#1f1f1f",
          card: "#1a1a1a",
          border: "#2a2a2a",
        },
      },
    },
  },
  plugins: [],
};
