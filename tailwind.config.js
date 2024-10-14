/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        geist: ['var(--font-geist-sans)'],
        'geist-mono': ['var(--font-geist-mono)'],
        mont: ['var(--font-mont)'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};