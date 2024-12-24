/** @type {import('tailwindcss').Config} */
export default {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "main-1": "#16423C",
        "main-2": "#6A9C89",
        "main-3": "#C4DAD2",
        "main-4": "#E9EFEC",
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
