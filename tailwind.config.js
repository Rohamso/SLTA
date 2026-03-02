module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d9ff',
          300: '#a4beff',
          400: '#7c9aff',
          500: '#5b7cff',
          600: '#3d5bff',
          700: '#2539ff',
          800: '#1a2ac4',
          900: '#151e8f',
        },
        secondary: {
          50: '#f8f9fb',
          100: '#f1f3f8',
          200: '#e3e8f2',
          300: '#c5cfe5',
          400: '#a7b8d8',
          500: '#8999c8',
          600: '#6b78b0',
          700: '#545f8f',
          800: '#3d4770',
          900: '#272f52',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        lalezar: ['Lalezar', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2937',
            h1: { fontWeight: '700' },
            h2: { fontWeight: '700' },
            h3: { fontWeight: '600' },
          },
        },
      },
    },
  },
  plugins: [],
}
