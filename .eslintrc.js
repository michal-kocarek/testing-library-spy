// TODO: Configure this properly - add stuff re react hooks, split per server/client, etc.
// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
};
