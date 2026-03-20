/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0eeff",
          100: "#ddd9ff",
          200: "#bcb4ff",
          300: "#9b8fff",
          400: "#7a6aff",
          500: "#5945e0",
          600: "#4534b8",
          700: "#322690",
          800: "#201a68",
          900: "#100e40",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Sora'", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
