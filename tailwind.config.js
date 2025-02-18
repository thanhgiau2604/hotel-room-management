/** @type {import('tailwindcss').Config} */
export default {
  purge: [
    "./app.vue",
    "./error.vue",
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "main-1": "#126358",
        "main-2": "#6A9C89",
        "main-3": "#C4DAD2",
        "main-4": "#E9EFEC",
        "main-5": "#104f30",
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
