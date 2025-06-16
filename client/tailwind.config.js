/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'primary': '#2563EB',        // Tailwind blue-600
        'primary-dark': '#1D4ED8',   // Tailwind blue-700
        'primary-light': '#EFF6FF',  // Tailwind blue-50
        'secondary': '#10B981',      // Tailwind emerald-500
        'secondary-dark': '#059669', // Tailwind emerald-600
        'neutral-text': '#1F2937',   // Tailwind gray-800
        'neutral-text-light': '#4B5563', // Tailwind gray-600
        'neutral-border': '#D1D5DB', // Tailwind gray-300
        'neutral-bg-light': '#F9FAFB',// Tailwind gray-50
        'neutral-bg-medium': '#F3F4F6',// Tailwind gray-100
        'custom-white': '#FFFFFF',
        'custom-black': '#000000',
        'success': '#22C55E',        // Tailwind green-500
        'error': '#EF4444',          // Tailwind red-500
        'warning': '#F97316',        // Tailwind orange-500
      },
    },
  },
  plugins: [],
}