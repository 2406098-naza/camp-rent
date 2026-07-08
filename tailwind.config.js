export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2D4F1E",
          dark: "#1D3513",
          light: "#3E6B2C",
        },
        secondary: {
          DEFAULT: "#D45D2A",
          dark: "#B04B1F",
          light: "#E07D53",
        },
        neutralDark: "#262626",
        accentGray: "#4A5D4E",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}