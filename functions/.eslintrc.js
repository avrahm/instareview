module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  overrides: [{ files: ["*.ts", "*.tsx"], }],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [
    "/dist/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "prettier",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "object-curly-spacing": ["error", "always", { "arraysInObjects": true }],
    "indent": 0,
    "new-cap": 0,
  },
};
