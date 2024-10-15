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
      colors: {
        bg: {
          DEFAULT: "#101606"
        },
        text: {
          DEFAULT: "#b1dd40"
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};