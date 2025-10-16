/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mainbg: "#0f0e11",
        cardbg: "#161716",
        positive: "#3ecf00",
        negative: "#e93030",
        fontcolor: "#c2c3c2",
      },
      fontFamily: {
        sans: ["Inter", "Quicksand", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
