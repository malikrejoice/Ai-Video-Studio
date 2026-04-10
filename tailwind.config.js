/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0e27',
          900: '#0f1629',
          800: '#1a202c',
          700: '#2d3748',
        },
        accent: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          blue: '#3b82f6',
        },
      },
      backgroundImage: {
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
