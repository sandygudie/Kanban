/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      primary: "hsla(242, 48% ,58%,1)",
      secondary: "hsla(0 ,0% ,12.55%,1)",
      "secondary-dark": "hsla(235, 16%, 15%,1)",
      gray: "hsla(216, 15%, 57%, 1)",
      success: "#44b774",
      white: "#ffffff",
      black: "hsla(0, 0% ,9.8%,1)",
      offwhite: "hsla(220, 69%, 97%, 1)",
      error: "#ea5555",
    },
    extend: {
      boxShadow: {
        "3xl":
          "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
      },
    },
    screens: {
      xs: "100px",
      sm: "300px",
      md: "991px",
      lg: "1200px",
    },
  },
  plugins: [],
};
