module.exports = {
  content: ["./public/**/*.html", "./public/assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: "#13231f",
        jade: "#0f766e",
        emeraldDeep: "#064e3b",
        dateGold: "#c99a3f",
        parchment: "#f7f2e8",
        pearl: "#fffaf0"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(13, 66, 55, 0.14)",
        glow: "0 0 0 1px rgba(201, 154, 63, 0.18), 0 28px 80px rgba(15, 118, 110, 0.18)"
      }
    }
  },
  plugins: []
};
