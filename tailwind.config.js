module.exports = {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "425px",
        tablet: "768px",
        desktop: "1024px",
        large: "1440px",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: "#000",
        white: "#fff",
        "blog-black": "#333333",
        "blog-red": "#b9301c",
        "meetup-blue": "#00455D",
        "gray-750": "#3f495a",
        "gray-850": "#222733",
        "gray-c7": "#c7c7c7",
        "gray-dark": "#333333",
        "gray-999": "#999999",
        "gray-900-spotify": "#121212",
        "gray-800-spotify": "#181818",
        "gray-700-spotify": "#282828",
        "blog-blue": "#232339",
        "peacoat": "#4F567C",
        "space-cadet": "#1E2952",
        "azure": "#3B82F6",
        "md-purple": "#A478E8"
      },
    },
  },
  plugins: [],
}
