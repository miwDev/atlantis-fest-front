/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        atlantis: {
          primary: "#002FA7", // Azul Klein
          secondary: "#5A6070", // Acero Frío
          white: "#E6E9F0", // Blanco Hielo
          "bg-main": "#161821", // Gris Plomo
          "bg-alt": "#0A0B10", // Negro Abisal
          success: "#1F8A4C", // Verde Placa Base
          error: "#D90429", // Carmesí Frío
          warning: "#E3B505", // Oro Pálido
          info: "#8ECAE6", // Azul Glaciar
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"], // Títulos gigantes y creativos
        plex: ['"IBM Plex Sans"', "sans-serif"], // Texto de UI, tablas y formularios
      },
      fontSize: {
        h1: ["5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }], // 80px (Invasivo)
        h2: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }], // 56px
        h3: ["2.5rem", { lineHeight: "1.1" }], // 40px
        h4: ["1.75rem", { lineHeight: "1.2" }], // 28px
        h5: ["1.25rem", { lineHeight: "1.2" }], // 20px
        h6: ["1rem", { lineHeight: "1.5" }], // 16px
        base: ["1rem", { lineHeight: "1.5" }], // 16px (Base)
        "base-lg": ["1.125rem", { lineHeight: "1.5" }], // 18px
        label: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.05em" }], // 14px (Etiquetas)
      },
    },
  },
  plugins: [],
};
