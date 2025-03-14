module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mainbg: "#0f0e11", // Fundo principal
        cardbg: "#161716", // Fundo dos cards e seções
        positive: "#3ecf00", // Saldo positivo e hover
        negative: "#e93030", // Saldo negativo
        fontcolor: "#c2c3c2", // Cor das fontes
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
