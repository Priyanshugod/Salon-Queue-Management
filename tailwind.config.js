/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF7F2',
        surface: {
          DEFAULT: '#FFFFFF',
          tint: '#F7EFEB',
          warm: '#FBF8F5',
        },
        terracotta: {
          light: '#FDF0EC',
          DEFAULT: '#E07A5F',
          hover: '#D36B50',
          dark: '#B8543A',
        },
        coral: {
          light: '#FDEAE4',
          DEFAULT: '#E57B62',
          accent: '#F26440',
        },
        charcoal: {
          DEFAULT: '#1F1F1F',
          soft: '#2C2B2A',
          muted: '#5A5550',
          light: '#8C847E',
        },
        hairline: {
          DEFAULT: '#E8E0D8',
          subtle: '#F0EAE4',
          dark: '#D5C9BE',
        },
        status: {
          available: '#3D7C57',
          'available-light': '#EAF3ED',
          busy: '#E07A5F',
          'busy-light': '#FDF0EC',
          break: '#C59B3F',
          'break-light': '#FDF7E7',
          called: '#E57B62',
          'called-light': '#FCEEEA',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 12px 40px rgba(224, 122, 95, 0.08)',
        'soft-glow': '0 0 25px rgba(224, 122, 95, 0.25)',
      }
    },
  },
  plugins: [],
}
