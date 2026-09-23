/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: '#070A12',
          card: '#0F1422',
          cardHover: '#151C2C',
          border: '#1F293D',
          red: '#E50914',
          orange: '#FF5722',
          gold: '#FFB800',
          cyan: '#00E5FF',
          purple: '#9D00FF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
