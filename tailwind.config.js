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
        primary: {
          light: '#4caf50',
          DEFAULT: '#2e7d32',
          dark: '#1b5e20',
        },
        secondary: {
          light: '#534bae',
          DEFAULT: '#1a237e',
          dark: '#000051',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
    },
  },
  plugins: [],
}