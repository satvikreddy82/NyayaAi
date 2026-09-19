/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00236f",
        "primary-container": "#1e3a8a",
        "on-primary": "#ffffff",
        "on-primary-container": "#90a8ff",
        "primary-fixed": "#dce1ff",
        "primary-fixed-dim": "#b6c4ff",
        "on-primary-fixed": "#00164e",
        "on-primary-fixed-variant": "#264191",
        "inverse-primary": "#b6c4ff",

        "secondary": "#006c4a",
        "secondary-container": "#82f5c1",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#00714e",
        "secondary-fixed": "#85f8c4",
        "secondary-fixed-dim": "#68dba9",
        "on-secondary-fixed": "#002114",
        "on-secondary-fixed-variant": "#005137",

        "tertiary": "#4f1700",
        "tertiary-container": "#742600",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ff8d5e",
        "tertiary-fixed": "#ffdbce",
        "tertiary-fixed-dim": "#ffb599",
        "on-tertiary-fixed": "#370e00",
        "on-tertiary-fixed-variant": "#7f2b00",

        "background": "#faf8ff",
        "on-background": "#131b2e",
        "surface": "#faf8ff",
        "on-surface": "#131b2e",
        "surface-variant": "#dae2fd",
        "on-surface-variant": "#444651",
        "surface-dim": "#d2d9f4",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "surface-tint": "#4059aa",
        "inverse-surface": "#283044",
        "inverse-on-surface": "#eef0ff",

        "outline": "#757682",
        "outline-variant": "#c5c5d3",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a"
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        'full': '9999px'
      }
    },
  },
  plugins: [],
}
