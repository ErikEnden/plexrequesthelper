module.exports = {
  content: [],
  theme: {
    colors: {
      transparent: "transparent",
      accent: "#7C7CA2",
      white: { dark: "#ADADAD", DEFAULT: "#FFFFFF" },
      grey: {
        dark: "#111118",
        DEFAULT: "#191924",
        light: "#212130",
      },
      success: {
        dark: "#0C975B",
        DEFAULT: "#11D07D",
      },
      warning: {
        dark: "#BF9E0D",
        DEFAULT: "#EFC81A",
      },
      danger: {
        dark: "#A81031",
        DEFAULT: "#E01541",
      },
    },
    extend: {},
  },
  plugins: [],
  purge: ["./src/**/*.vue"],
};
