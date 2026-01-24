/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pixel: {
          dark: '#0f0f1a',
          darker: '#0a0a12',
          surface: '#1a1a2e',
          border: '#2a2a4e',
          green: '#00ff88',
          blue: '#00d4ff',
          gold: '#ffd700',
          red: '#ff6b6b',
          purple: '#b388ff',
          orange: '#ff9500',
          pink: '#ff69b4',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        terminal: ['VT323', 'monospace'],
      },
      animation: {
        'pixel-bounce': 'pixelBounce 0.5s ease-in-out infinite',
        'pixel-glow': 'pixelGlow 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'typing': 'typing 0.1s steps(1)',
        'coin-collect': 'coinCollect 0.3s ease-out',
      },
      keyframes: {
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pixelGlow: {
          '0%, 100%': { boxShadow: '0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 30px currentColor, 0 0 60px currentColor' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        coinCollect: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: 1 },
          '100%': { transform: 'scale(1.5) translateY(-20px)', opacity: 0 },
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 rgba(0, 255, 136, 0.3)',
        'pixel-lg': '8px 8px 0 0 rgba(0, 255, 136, 0.3)',
        'neon': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
      },
    },
  },
  plugins: [],
};
