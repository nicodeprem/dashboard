/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    { pattern: /^(bg|text|border)-(purple|blue|emerald|amber|teal|indigo|rose)-(50|100|200|400|600|700)$/ },
  ],
  theme: { extend: {} },
  plugins: [],
}
