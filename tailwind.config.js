/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#111827',
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          500: '#1685c7',
          600: '#0f6ca6',
          700: '#0c5687',
          900: '#083653'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)'
      }
    },
  },
  plugins: [],
};
