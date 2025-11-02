/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          light: '#E0F7FA', // Light blue for backgrounds
          DEFAULT: '#00B8D4', // Main brand color
          dark: '#00838F', // Darker shade for hover states
        },
        'brand-white': '#FFFFFF',
        'brand-gray': {
          light: '#F5F5F5', // for inputs and other neutral backgrounds
          DEFAULT: '#9E9E9E',
          dark: '#424242',
        },
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}
