/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ederest: {
          primary: '#4F46E5',
          'primary-light': '#EEF2FF',
          'accent-green-bg': '#ECFDF5',
          'accent-green': '#059669',
          'accent-orange': '#F59E0B',
          'callout-bg': '#EAF1FB',
          'illustration-bg': '#DCE7F9',
          surface: '#FFFFFF',
          'page-bg': '#F5F6F8',
          border: '#E5E7EB',
          'text-primary': '#111827',
          'text-secondary': '#6B7280',
          'text-muted': '#9CA3AF',
          'success-dot': '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'pill': '999px',
      }
    },
  },
  plugins: [],
}
