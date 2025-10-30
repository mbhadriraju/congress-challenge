/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: '#4E4FEB',
        primaryDark: '#3B3CC9',
        primaryLight: '#6B6DFF',
        secondary: '#068FFF',
        accent: '#00D9FF',
        
        // Background colors
        bg: '#0A0A0A',
        bgSecondary: '#121212',
        bgTertiary: '#1A1A1A',
        surface: '#181C14',
        surfaceElevated: '#1F1F1F',
        
        // Text colors
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        textTertiary: '#808080',
        textMuted: '#666666',
        
        // Status colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        
        // Legacy compatibility
        col1: '#FFFFFF',
        col2: '#068FFF',
        col3: '#4E4FEB',
        col4: '#0A0A0A',
        col5: '#181C14',
        dg: '#181C14',
        lg: "#D3D3D3"
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}