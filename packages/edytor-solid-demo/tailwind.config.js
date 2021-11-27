module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Noto Sans HK"],
      serif: ["Playfair Display"],
      mono: ["Space Mono"]
    },

    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/typography")]
};
