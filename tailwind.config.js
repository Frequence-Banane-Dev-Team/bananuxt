const animate = require("tailwindcss-animate")
const plugin = require("tailwindcss/plugin")


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        banane: "#FFBB00",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        "collapsible-up": {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
    },
  },
  plugins: [
    animate,
    plugin(({ theme, addUtilities }) => {
      const neonUtilities = {}

      const colors = theme('colors')
      const sizes = {
        'xs': ['0 0 1px', '0 0 4px'],
        'sm': ['0 0 2px', '0 0 8px'],
        'md': ['0 0 4px', '0 0 12px'],
        'lg': ['0 0 8px', '0 0 16px'],
        'xl': ['0 0 12px', '0 0 20px'],
        '2xl': ['0 0 16px', '0 0 24px'],
      }


      for (const key in sizes) {
        const value = sizes[key];
        const size1 = value[0]
        const size2 = value[1]
        
        for (const color in colors) {
          if (typeof colors[color] === 'object') {
            const color1 = colors[color]['500']
            const color2 = colors[color]['700']
            neonUtilities[`.neon-${key}-${color}`] = {
              filter: `drop-shadow(${size1} ${color1}) drop-shadow(${size2} ${color2})`
            }
          }
        }
        neonUtilities[`.neon-${key}-white`] = {
          filter: `drop-shadow(${size1} white) drop-shadow(${size2} white)`
        }
      }

      

      addUtilities(neonUtilities)
    })
  ],
}