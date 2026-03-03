/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#F5EFE0',
          panel: '#FDF6E8',
          border: '#2C2416',
          title: '#E8A87C',
          pink: '#E8A0BF',
          lavender: '#C9B8E8',
          green: '#A8D5BA',
          text: '#2C2416',
          muted: '#7A6A52',
          shadow: '#D4C9B0',
        },
      },
    },
  },
  plugins: [],
};
