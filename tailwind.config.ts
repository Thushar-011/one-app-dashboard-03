import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8B5CF6",
          dark: "#7E69AB",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#06D6A0",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#666666",
          foreground: "#999999",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Satoshi", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" }
        },
        "flow-colors": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "0% 50%"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "100% 50%"
          }
        },
        "trash-open": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2) rotate(5deg)" },
          "100%": { transform: "scale(1)" }
        },
        "widget-to-trash": {
          "0%": { 
            transform: "scale(1) rotate(0deg)",
            opacity: "1"
          },
          "50%": { 
            transform: "scale(0.5) rotate(180deg)",
            opacity: "0.5"
          },
          "100%": { 
            transform: "scale(0) rotate(360deg)",
            opacity: "0"
          }
        },
        "button-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "flow-colors": "flow-colors 3s ease infinite",
        "trash-open": "trash-open 0.5s ease-in-out",
        "widget-to-trash": "widget-to-trash 0.5s ease-in-out forwards",
        "button-pop": "button-pop 0.2s ease-in-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;