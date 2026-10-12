/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        devcraft: {
          bg: '#0B0B0B',
          surface: '#121212',
          card: '#181818',
          border: '#262626',
          hover: 'rgba(255, 255, 255, 0.05)',
          primary: '#EEEEEE',
          primaryHover: '#FFFFFF',
          secondary: '#C9C9C9',
          accent: '#EEEEEE',
          muted: '#8D8D8D',
          text: '#EEEEEE',
          heading: '#FFFFFF',
        },
        nf: {
          page: '#0B0B0B',
          paper: '#121212',
          card: '#181818',
          raise: '#1E1E1E',
          ink: '#EEEEEE',
          soft: '#C9C9C9',
          muted: '#8D8D8D',
          faint: '#5D5D5D',
          line: '#262626',
          lineStrong: '#363636',
          bracket: '#444444',
          band: '#1D1D1D',
          inv: '#EFEFEF',
          invInk: '#121212',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(255, 255, 255, 0.15)',
        'glow-secondary': '0 0 25px -5px rgba(200, 200, 200, 0.15)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'nf': '0 1px 2px rgba(0,0,0,.4), 0 10px 30px -14px rgba(0,0,0,.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
