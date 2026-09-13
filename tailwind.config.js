/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005c55',
          container: '#0f766e',
          fixed: '#9cf2e8',
          'fixed-dim': '#80d5cb',
          dark: '#004a44',
          hover: '#0d655e',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#a3faef',
        secondary: {
          DEFAULT: '#0058be',
          container: '#2170e4',
          fixed: '#d8e2ff',
          'fixed-dim': '#adc6ff',
          hover: '#004a9e',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#fefcff',
        tertiary: {
          DEFAULT: '#734700',
          container: '#945d00',
          fixed: '#ffddb8',
          'fixed-dim': '#ffb95f',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ffe6cc',
        surface: {
          DEFAULT: '#f8f9ff',
          dim: '#cbdbf5',
          bright: '#f8f9ff',
          'container-lowest': '#ffffff',
          'container-low': '#eff4ff',
          container: '#e5eeff',
          'container-high': '#dce9ff',
          'container-highest': '#d3e4fe',
          variant: '#d3e4fe',
          tint: '#006a63',
        },
        'on-surface': '#0b1c30',
        'on-surface-variant': '#3e4947',
        outline: {
          DEFAULT: '#6e7977',
          variant: '#bdc9c6',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        // Clinical Grading Specific Colors
        dr: {
          none: '#10b981',
          'none-bg': '#ecfdf5',
          'none-border': '#a7f3d0',
          'none-text': '#065f46',
          mild: '#f59e0b',
          'mild-bg': '#fffbeb',
          'mild-border': '#fde68a',
          'mild-text': '#92400e',
          moderate: '#ea580c',
          'moderate-bg': '#fff7ed',
          'moderate-border': '#fed7aa',
          'moderate-text': '#9a3412',
          severe: '#ef4444',
          'severe-bg': '#fef2f2',
          'severe-border': '#fecaca',
          'severe-text': '#991b1b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
