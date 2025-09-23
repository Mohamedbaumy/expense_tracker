/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50",
        secondary: "#FFFFFF",
        background: "#F5F7FA",
        foreground: "#1D2C3D",
        muted: "#BDC3C7",
        success: "#2ECC71",
        danger: "#E74C3C",
      },
    },
  },
};
