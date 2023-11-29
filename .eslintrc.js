module.exports = {
  ignorePatterns: [
    ".angular/",
    ".github/",
    ".vscode/",
    "node_modules/",
    "dist/",
    ".*",
    "tailwind.config.js",
    "example-file.js",
  ],
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
	"@typescript-eslint/no-explicit-any": ["off"],
	"@typescript-eslint/ban-ts-comment": ["off"],
	"no-undef": ["off"],
	"no-mixed-spaces-and-tabs": ["off"],
  },
};
