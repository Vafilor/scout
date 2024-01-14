module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
    "plugin:react-hooks/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "project": ["./tsconfig.json"],
    "tsconfigRootDir": __dirname,
  },
  root: true,
  ignorePatterns: ["webpack.*", ".eslintrc.js", "forge.config.ts", "drizzle.config.ts"],
  plugins: ["import"],
  settings: {
    "import/resolver": {
      "typescript": {
        // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        "alwaysTryTypes": true,

        "project": "tsconfig.json"
      }
    }
  },
  rules: {
    // turn on errors for missing imports
    "import/no-unresolved": "error"
  },
}
