/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            primary: {
                DEFAULT: '#65E5A6',
                50: '#FFFFFF',
                100: '#F1FDF7',
                200: '#CEF7E3',
                300: '#ABF1CE',
                400: '#88EBBA',
                500: '#65E5A6',
                600: '#35DD8A',
                700: '#1FBA6E',
                800: '#178A52',
                900: '#0F5A35',
                950: '#0B4227'
              },
        }
    },
  },
  plugins: [],
}

