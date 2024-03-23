/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],

  theme: {
    colors: {
      primary: "hsl(242.31deg 48.15% 57.65%)",
      // secondary: "hsla(0 ,0% ,12.55%,1)",
      // "secondary-dark": "hsla(235, 16%, 15%,1)",
      gray: "hsla(216, 15%, 57%, 1)",
      success: "#44b774",
      white: "#ffffff",
      black: "hsla(0, 0% ,9.8%,1)",
      offwhite: "hsla(220, 69%, 97%, 1)",
      error: "#ea5555",
      "gray-200": "hsla(216, 15%, 57%, 0.15)",
      "gray-100": "hsla(216, 15%, 57%, 0.1)",
      "gray-300": "hsla(216, 15%, 57%, 0.3)",
    },
    extend: {
      colors: {
        secondary: "var(--color-secondary)",
        typography: "var(--color-typography)",
        main: "var(--color-main)",
      },
      boxShadow: {
        "3xl":
          "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
      },
    },
    screens: {
      xs: "100px",
      sm: "300px",
      mini: "700px",
      md: "991px",
      lg: "1200px",
    },
  },
  plugins: [],
};
