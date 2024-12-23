export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        granite: {
          100: "#cad3e1",
          200: "#acb6c8",
          300: "#8c99af",
          400: "#75839c",
          500: "#5e6f8a",
          600: "#516179",
          700: "#414e63",
          800: "#313c4d",
          900: "#1f2836",
        },
        bray: {
          500: "#2196f0",
          600: "#1d88e2",
          700: "#1676cf",
          800: "#1166bd",
          900: "#07489f",
        },
      },
      fontFamily: {
        sans: [
          '"Open Sans"',
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
};
