/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#76b852',
        secondary: '#8b5a2b',
        accent: '#f5b041',
        background: '#f5f5f5',
        text: '#333333',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        garden: {
          "primary": "#76b852",
          "secondary": "#8b5a2b",
          "accent": "#f5b041",
          "neutral": "#f5f5f5",
          "base-100": "#F7F1DF",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}