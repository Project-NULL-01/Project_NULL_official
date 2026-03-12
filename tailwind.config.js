/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        system: {
          black: "#0B0C10",
          dark: "#1F2833",
          neon: "#00f3ff",
          alert: "#ff003c",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        mono: ['"Monospace"', 'monospace'],
        display: ['"Rajdhani"', 'sans-serif'],
      },
      animation: {
        'matrix-rain': 'matrix-fall 20s linear infinite',
        'glitch-fast': 'glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'blink-slow': 'blink 2s step-end infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'matrix-fall': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch-skew': {
          '0%': { transform: 'skew(0deg)' },
          '20%': { transform: 'skew(-20deg)' },
          '40%': { transform: 'skew(20deg)' },
          '60%': { transform: 'skew(-10deg)' },
          '80%': { transform: 'skew(10deg)' },
          '100%': { transform: 'skew(0deg)' },
        },
        'blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 5px #00f3ff, 0 0 20px #00f3ff' },
          '50%': { opacity: .7, boxShadow: '0 0 2px #00f3ff, 0 0 10px #00f3ff' },
        }
      },
      backgroundImage: {
        'stripe-pattern': 'repeating-linear-gradient(transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
      }
    },
  },
  plugins: [],
}
