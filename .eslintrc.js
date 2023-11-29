module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "plugin:tailwindcss/recommended"],
  overrides: [
    {
	  files: ["*.ts", "*.tsx", "*.js"],
	  parser: "@typescript-eslint/parser",
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "no-undef": ["off"],
  },
};
