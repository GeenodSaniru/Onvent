/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        background: '#F9FAFB',
        text: '#1F2937',
        accent: '#22C55E',
      },
    },
  },
  plugins: [],
}