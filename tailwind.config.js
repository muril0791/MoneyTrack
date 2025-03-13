module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Azul escuro (confiança)
        secondary: "#10b981", // Verde (entradas)
        danger: "#ef4444", // Vermelho (saídas)
        dark: "#111827",
        light: "#f3f4f6",
        accent: "#fbbf24",
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
