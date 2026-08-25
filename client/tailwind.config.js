/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
        coral: {
          DEFAULT: '#F26A4B',
          50: '#fef2ee',
          100: '#fde3da',
          200: '#fbc7b6',
          300: '#f7a48c',
          400: '#f4795b',
          500: '#F26A4B',
          600: '#e04c2b',
          700: '#bc391d',
          800: '#99311b',
          900: '#7e2c1b',
        },
        brand: {
          50: '#fef2ee',
          100: '#fde3da',
          200: '#fbc7b6',
          300: '#f7a48c',
          400: '#f4795b',
          500: '#F26A4B',
          600: '#e04c2b',
          700: '#bc391d',
          800: '#99311b',
          900: '#7e2c1b',
          950: '#44140a',
        },
        dark: {
          bg: '#141414',
          surface: '#1C1C1C',
          card: '#222222',
          border: '#2C2C2C',
          muted: '#8E8A83',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        custom: 'var(--letter-spacing)',
      },
      boxShadow: {
        'theme-sm': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'theme-md': '0 6px 15px rgba(0, 0, 0, 0.2)',
        'glow-sm': '0 0 20px -5px rgba(242, 106, 75, 0.3)',
        'glow-lg': '0 0 40px -10px rgba(242, 106, 75, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
