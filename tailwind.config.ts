import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void:    '#06060e',
        deep:    '#0b0b18',
        surface: '#10101f',
        card:    '#14142a',
        elevated:'#1c1c35',
        violet: {
          DEFAULT: '#6d28d9',
          mid:     '#8b5cf6',
          glow:    '#a78bfa',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        serif:   ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
      },
      animation: {
        shimmer:  'shimmer 1.6s linear infinite',
        'fade-up':'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'row-in': 'rowIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-dn':'slideDown 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'heart':  'heartPulse 0.38s cubic-bezier(0.34,1.56,0.64,1)',
        'palette-in':'paletteIn 0.22s cubic-bezier(0.16,1,0.3,1) both',
        'img-in': 'imgFadeIn 0.4s ease',
      },
      keyframes: {
        shimmer: {
          'from': { backgroundPosition: '200% 0' },
          'to':   { backgroundPosition: '-200% 0' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(22px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        rowIn: {
          'from': { opacity: '0', transform: 'translateX(-14px)' },
          'to':   { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-100%)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        heartPulse: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.45)' },
          '70%':  { transform: 'scale(0.85)' },
          '100%': { transform: 'scale(1)' },
        },
        paletteIn: {
          'from': { opacity: '0', transform: 'translateY(-16px) scale(0.96)' },
          'to':   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        imgFadeIn: {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
