/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        col1: '#FFFFFF',
        col2: '#068FFF',
        col3: '#4E4FEB',
        col4: '#000000',
        dg: '#181C14',
        lg: "#D3D3D3"
      }
    } ,
  },
  plugins: [],
}