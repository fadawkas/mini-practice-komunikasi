/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        'primary-dark': '#1E40AF',
        accent: '#7C3AED',
        cyan: '#06B6D4',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 24px 80px rgba(15,23,42,0.08)',
        'glass-lg': '0 32px 96px rgba(15,23,42,0.10)',
        'primary-glow': '0 8px 32px rgba(37,99,235,0.25)',
      },
      backdropBlur: {
        'xl': '24px',
      },
    },
  },
  plugins: [],
}