/** @type {import('tailwindcss').Config} */
import tailwindcssTypography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

const fontFamily = {
  sans: ['Arial', ...defaultTheme.fontFamily.sans],
  narrow: [
    '"Arial Narrow"',
    '"Arial Narrow OS"',
    ...defaultTheme.fontFamily.sans,
  ],
  serif: ['Times New Roman', ...defaultTheme.fontFamily.sans],
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Default theme configuration
    // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
    extend: {
      colors: {
        // TailwindCSS Color Generator
        // https://uicolors.app/create
        // https://tailwindcss.com/docs/customizing-colors
        accent: '#CDFF50',
      },
      spacing: {
        'page-mx': 'var(--page-mx)',
        '18': rem(72),
        '19': rem(74),
        '0.25': rem(1),
        '0.25em': '0.25em',
        '0.5em': '0.5em',
        '0.75em': '0.75em',
        'em': '1em',
        '1em': '1em',
        '1.25em': '1.25em',
        '1.5em': '1.5em',
        '1.75em': '1.75em',
        '2em': '2em',
        'svh': ['100vh', '100svh'],
      },
      aspectRatio: {
        // https://tailwindcss.com/docs/aspect-ratio
        // '2/5': '2/5', // 0.4
        // '9/21': '9/21', // 0.4285714286
        // '1/2': '1/2', // 0.5
        '9/16': '9/16', // 0.5625
        // '2/3': '2/3', // 0.6666666667
        // '3/4': '3/4', // 0.75
        // '1/1': '1/1', // 1
        // '4/3': '4/3', // 1.3333333333
        // '3/2': '3/2', // 1.5
        '16/9': '16/9', // 1.7777777778
        // '2/1': '2/1', // 2
        // '21/9': '21/9', // 2.3333333333
        // '5/2': '5/2', // 2.5
      },
      fontSize: {
        // https://tailwindcss.com/docs/font-size
        // 'xs': [rem(12), { lineHeight: rem(16) }],
        // 'sm': [rem(14), { lineHeight: rem(20) }],
        // 'base': [rem(16), { lineHeight: rem(24) }],
        // 'lg': [rem(18), { lineHeight: rem(28) }],
        // 'xl': [rem(20), { lineHeight: rem(28) }],
        // '2xl': [rem(24), { lineHeight: rem(32) }],
        // '3xl': [rem(30), { lineHeight: '1' }],
        // '4xl': [rem(36), { lineHeight: '1' }],
        // '5xl': [rem(48), { lineHeight: '1' }],
        // '6xl': [rem(64), { lineHeight: '1' }],
        // '7xl': [rem(80), { lineHeight: '1' }],
        // '8xl': [rem(96), { lineHeight: '1' }],
        // '9xl': [rem(128), { lineHeight: '1' }],
        13: [rem(13), { lineHeight: '1' }],
        16: [rem(16), { lineHeight: '1' }],
        18: [rem(18), { lineHeight: '1' }],
        20: [rem(20), { lineHeight: '1' }],
        22: [rem(22), { lineHeight: '1' }],
        25: [rem(25), { lineHeight: '1' }],
        32: [rem(32), { lineHeight: '1' }],
        35: [rem(35), { lineHeight: '1' }],
        38: [rem(38), { lineHeight: '1' }],
        42: [rem(42), { lineHeight: '1' }],
        45: [rem(45), { lineHeight: '1' }],
      },
      fontWeight: {
        // https://tailwindcss.com/docs/font-weight
        '100': '100', // thin
        '200': '200', // extralight
        '300': '300', // light
        '400': '400', // normal
        '500': '500', // medium
        '600': '600', // semibold
        '700': '700', // bold
        '800': '800', // extrabold
        '900': '900', // black
      },
      fontFamily,
      letterSpacing: {
        tighter: '-0.04em',
        wider: '0.04em',
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      height: {
        'svh': ['100vh', '100svh'],
      },
      minHeight: {
        'svh': ['100vh', '100svh'],
      },
      width: {},
      maxWidth: {
        text: rem(740),
        heading: rem(960),
      },
      minWidth: {},
      transitionProperty: {
        'fade': 'opacity, visibility',
      },
      transitionDelay: {
        // '50': '50ms',
        // '100': '100ms',
        // '150': '150ms',
        // '200': '200ms',
        // '250': '250ms',
        // '300': '300ms',
        // '350': '350ms',
        // '400': '400ms',
        // '450': '450ms',
        // '500': '500ms',
        // '550': '550ms',
        // '600': '600ms',
        // '650': '650ms',
        // '700': '700ms',
        // '750': '750ms',
        // '800': '800ms',
        // '850': '850ms',
        // '900': '900ms',
        // '950': '950ms',
        // '1000': '1000ms',
      },
      transitionTimingFunction: {
        // https://tailwindcss.com/docs/transition-timing-function
        // 'css-in-out': 'ease-in-out',
        // 'in-sine': 'cubic-bezier(0.12, 0, 0.39, 0)',
        // 'out-sine': 'cubic-bezier(0.61, 1, 0.88, 1)',
        // 'in-out-sine': 'cubic-bezier(0.37, 0, 0.63, 1)',
        // 'in-power1': 'cubic-bezier(0.11, 0, 0.5, 0)',
        // 'out-power1': 'cubic-bezier(0.5, 1, 0.89, 1)',
        // 'in-out-power1': 'cubic-bezier(0.45, 0, 0.55, 1)',
        // 'in-power2': 'cubic-bezier(0.32, 0, 0.67, 0)',
        // 'out-power2': 'cubic-bezier(0.33, 1, 0.68, 1)',
        // 'in-out-power2': 'cubic-bezier(0.65, 0, 0.35, 1)',
        // 'in-power3': 'cubic-bezier(0.5, 0, 0.75, 0)',
        // 'out-power3': 'cubic-bezier(0.25, 1, 0.5, 1)',
        // 'in-out-power3': 'cubic-bezier(0.76, 0, 0.24, 1)',
        // 'in-power4': 'cubic-bezier(0.64, 0, 0.78, 0)',
        // 'out-power4': 'cubic-bezier(0.22, 1, 0.36, 1)',
        // 'in-out-power4': 'cubic-bezier(0.83, 0, 0.17, 1)',
        // 'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        // 'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        // 'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        // 'in-circ': 'cubic-bezier(0.55, 0, 1, 0.45)',
        // 'out-circ': 'cubic-bezier(0, 0.55, 0.45, 1)',
        // 'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
        // 'in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        // 'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        // 'in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      borderRadius: {
        xl: '2rem',
      },
      screens: {
        'smmax': { 'max': '640px' },
        'mdmax': { 'max': '768px' },
        'lgmax': { 'max': '1024px' },
        'xlmax': { 'max': '1280px' },
        '2xlmax': { 'max': '1536px' },
        'hovers': { raw: '(hover: hover)' },
        'hoversnot': { raw: '(hover: none)' },
      },
      cursor: {
        'left': 'w-resize',
        'right': 'e-resize',
      },
      animation: {
        'project-heading-in':
          'fade-in-slide 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1s both',
        'project-controls-in':
          'fade-in-slide 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.3s both',
      },
      zIndex: {
        'header': 9000,
      },
      typography: {
        // https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
        DEFAULT: {
          css: {},
        },
        compact: {
          css: {
            lineHeight: '1.5',
          },
        },
        black: {
          css: {
            '--tw-prose-body': colors.black,
            '--tw-prose-headings': colors.black,
            '--tw-prose-lead': colors.black,
            '--tw-prose-links': colors.black,
            '--tw-prose-bold': colors.black,
            '--tw-prose-counters': colors.black,
            '--tw-prose-bullets': colors.black,
            '--tw-prose-hr': colors.black,
            '--tw-prose-quotes': colors.black,
            '--tw-prose-quote-borders': colors.black,
            '--tw-prose-captions': colors.black,
            '--tw-prose-code': colors.black,
            '--tw-prose-pre-code': colors.black,
            '--tw-prose-pre-bg': colors.black,
            '--tw-prose-th-borders': colors.black,
            '--tw-prose-td-borders': colors.black,
            '--tw-prose-invert-body': colors.white,
            '--tw-prose-invert-headings': colors.white,
            '--tw-prose-invert-lead': colors.white,
            '--tw-prose-invert-links': colors.white,
            '--tw-prose-invert-bold': colors.white,
            '--tw-prose-invert-counters': colors.white,
            '--tw-prose-invert-bullets': colors.white,
            '--tw-prose-invert-hr': colors.white,
            '--tw-prose-invert-quotes': colors.white,
            '--tw-prose-invert-quote-borders': colors.white,
            '--tw-prose-invert-captions': colors.white,
            '--tw-prose-invert-code': colors.white,
            '--tw-prose-invert-pre-code': colors.white,
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': colors.white,
            '--tw-prose-invert-td-borders': colors.white,
          },
        },
        white: {
          css: {
            '--tw-prose-body': colors.white,
            '--tw-prose-headings': colors.white,
            '--tw-prose-lead': colors.white,
            '--tw-prose-links': colors.white,
            '--tw-prose-bold': colors.white,
            '--tw-prose-counters': colors.white,
            '--tw-prose-bullets': colors.white,
            '--tw-prose-hr': colors.white,
            '--tw-prose-quotes': colors.white,
            '--tw-prose-quote-borders': colors.white,
            '--tw-prose-captions': colors.white,
            '--tw-prose-code': colors.white,
            '--tw-prose-pre-code': colors.white,
            '--tw-prose-pre-bg': colors.white,
            '--tw-prose-th-borders': colors.white,
            '--tw-prose-td-borders': colors.white,
            '--tw-prose-invert-body': colors.black,
            '--tw-prose-invert-headings': colors.black,
            '--tw-prose-invert-lead': colors.black,
            '--tw-prose-invert-links': colors.black,
            '--tw-prose-invert-bold': colors.black,
            '--tw-prose-invert-counters': colors.black,
            '--tw-prose-invert-bullets': colors.black,
            '--tw-prose-invert-hr': colors.black,
            '--tw-prose-invert-quotes': colors.black,
            '--tw-prose-invert-quote-borders': colors.black,
            '--tw-prose-invert-captions': colors.black,
            '--tw-prose-invert-code': colors.black,
            '--tw-prose-invert-pre-code': colors.black,
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': colors.black,
            '--tw-prose-invert-td-borders': colors.black,
          },
        },
      },
    },
  },
  plugins: [
    tailwindcssTypography,
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.stack': {
          display: 'grid',
        },
        '.stack > *': {
          'grid-area': '1/1',
          width: '100%',
        },
      })
    }),
  ],
}
