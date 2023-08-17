/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "600px",
        md: "728px",
      },
    },
    extend: {
      colors: {
        primary: "#1DB954",
        secondary: "#191414",
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
