/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          50: '#F7F8FB',
          100: '#EEF0F7',
          900: '#0B0F19',
          950: '#070A12',
        },
        ink: {
          light: '#12131A',
          dark: '#E7E9F2',
        },
        brand: {
          violet: '#7C6AED',
          violetDeep: '#5B4BCB',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(rgba(11,15,25,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,15,25,0.04) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(rgba(231,233,242,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(231,233,242,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(11, 15, 25, 0.12)',
        glow: '0 0 60px -15px rgba(124, 106, 237, 0.55)',
        'glow-emerald': '0 0 50px -12px rgba(16, 185, 129, 0.55)',
        'glow-amber': '0 0 50px -12px rgba(245, 158, 11, 0.55)',
      },
      animation: {
        'pulse-slow': 'pulse-slow 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        scan: 'scan 2.6s linear infinite',
        float: 'float 8s ease-in-out infinite',
        'float-delay': 'float 10s ease-in-out infinite 1.5s',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.55, transform: 'scale(0.96)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(15px,-25px)' },
        },
      },
      clipPath: {
        hex: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.clip-hex': {
          clipPath:
            'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)',
        },
      })
    },
  ],
}
