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
        primary: "#8B593E",
        secondary: "#FFFFFF",
        border: "#E4D8CB",
        background: "#FFF8F3",
        foreground: "#413934",
        muted: "#918A84",
        success: "#3FC37E",
        danger: "#E25548",
      },
    },
  },
}