/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      primary: "hsla(242, 48% ,58%,1)",
      secondary: "hsla(235, 12% ,19%,1)",
      "secondary-dark": "hsla(235, 16%, 15%,1)",
      gray: "hsla(216, 15%, 57%, 1)",
      dark: "#212529",
      "sky-blue": "hsla(193, 75%, 59%,1)",
      purple: "hsla(249, 83% ,70%, 1)",
      "sea-green": "hsla(155, 68% ,65%, 1)",
      white: '#ffffff',
      black:'#000',
      offwhite:"hsla(220, 69%, 97%, 1)",
      error: "#ea5555"
    },
    extend: {
      boxShadow: {
        '3xl': 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
      }
    }
  },
  plugins: [],
};
