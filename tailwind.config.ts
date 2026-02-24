import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#4db6ac',
          500: '#4A9B9B',
          600: '#3d8a8a',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'inherit',
            a: {
              color: '#4A9B9B',
              '&:hover': { color: '#3d8a8a' },
            },
            'h1, h2, h3, h4': { color: 'inherit' },
            code: { color: '#4A9B9B' },
            'pre code': { color: '#c9d1d9' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
