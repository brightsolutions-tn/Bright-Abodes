/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          terracotta: '#D4524E',
          navy: '#1A1A2E',
          champagne: '#C9A96E',
          warmGold: '#E8B84B',
          sage: '#8DB58E',
          warmIvory: '#F2ECE4',
          charcoal: '#2D2D3A',
          stone: '#8E8E9A',
          warmGray: '#D6D0CA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
