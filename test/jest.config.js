module.exports = {
  preset: "ts-jest",
  testRegex: "\\.test\\.tsx$",
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["./test/setup.ts"],
  rootDir: "../",
};
