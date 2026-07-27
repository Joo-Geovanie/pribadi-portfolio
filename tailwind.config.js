/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          900: '#0b132b', // Twilight dark blue
          950: '#020514', // Abyssal pitch black
        },
        sonar: {
          green: '#00ff66',  // Bright radar green
          blue: '#00f0ff',   // Bioluminescent blue
          orange: '#ff5e00', // Warning status indicator
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
