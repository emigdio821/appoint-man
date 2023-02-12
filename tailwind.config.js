/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const { blackA, violet, mauve, slateA, gray } = require('@radix-ui/colors')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...violet,
        ...mauve,
        ...slateA,
        ...gray,
      },
      fontSize: {
        ssm: '0.8125rem',
      },
      screens: {
        xs: '475px',
        ...defaultTheme.screens,
      },
      keyframes: {
        slideUpAndFade: {
          '0%': { opacity: 0, transform: 'translateY(2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          '0%': { opacity: 0, transform: 'translateX(-2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideDownAndFade: {
          '0%': { opacity: 0, transform: 'translateY(-2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          '0%': { opacity: 0, transform: 'translateX(2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        swipeOut: {
          '0%': {
            transform: 'translateX(var(--radix-toast-swipe-end-x))',
          },
          '100%': {
            transform: `translateX(calc(100% + ${defaultTheme.spacing[6]}))`,
          },
        },
        slideIn: {
          '0%': {
            opacity: 0,
            transform: `translateX(calc(100% + ${defaultTheme.spacing[6]}))`,
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        hide: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(2px)',
          },
        },
        overlayShow: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        contentShow: {
          '0%': { opacity: 0, transform: 'translate(-50%, -45%)' },
          '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        contentHide: {
          '0%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          '100%': {
            opacity: 0,
            transform: 'translate(-50%, -45%)',
          },
        },
      },
      animation: {
        slideUpAndFade: 'slideUpAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideDownAndFade:
          'slideDownAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideRightAndFade:
          'slideRightAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideLeftAndFade:
          'slideLeftAndFade 300ms cubic-bezier(0.16, 0, 0.13, 1)',
        slideIn: 'slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        hide: 'hide 0.1s ease-in',
        swipeOut: 'swipeOut 100ms ease-out',
        overlayShow: 'overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentHide: 'contentHide 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
