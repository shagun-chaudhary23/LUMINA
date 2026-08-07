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
        cream: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EAE1D3',
          300: '#DCD0BE',
          400: '#C8B8A2',
          800: '#2A2320',
          900: '#1F1B18',
        },
        lumina: {
          red: '#991B1B',
          crimson: '#700018',
          accent: '#C2410C',
          rose: '#FCA5A5',
          gold: '#D97706',
          lightred: '#FEF2F2',
        },
        editorial: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          border: '#E8E1D7',
          darkbg: '#141110',
          darkcard: '#1D1917',
          darkborder: '#332C28',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'editorial': '0 10px 30px -10px rgba(153, 27, 27, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'editorial-hover': '0 20px 40px -15px rgba(153, 27, 27, 0.15), 0 8px 20px rgba(0, 0, 0, 0.06)',
        'glow-red': '0 0 20px rgba(153, 27, 27, 0.25)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
