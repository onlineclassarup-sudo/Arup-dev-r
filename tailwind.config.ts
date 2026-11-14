import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: {
          950: "#02040a",
          900: "#030712",
          850: "#050508",
          800: "#0a0f1d",
          700: "#0f172a",
        },
        neon: {
          cyan: "#00f5ff",
          purple: "#9d4edd",
          crimson: "#ff2a4b",
          green: "#00ff88",
          amber: "#ffb703",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-orbitron)", "monospace", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "border-sweep": "borderSweep 6s linear infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%": { opacity: "0.3", transform: "scale(0.98)" },
          "100%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        borderSweep: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 25px -5px rgba(0, 245, 255, 0.4)",
        "neon-purple": "0 0 25px -5px rgba(157, 78, 221, 0.4)",
        "neon-crimson": "0 0 25px -5px rgba(255, 42, 75, 0.4)",
        "neon-green": "0 0 25px -5px rgba(0, 255, 136, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};
export default config;

