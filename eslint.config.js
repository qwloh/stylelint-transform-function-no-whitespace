import markdown from "eslint-plugin-markdown";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    ignores: ["dist/*"],
  },
  {
    plugins: {
      markdown,
    },
  },
  {
    files: ["*.md", "**/*.md"],
    processor: "markdown/markdown", // only lint js/jsx/ts/tsx code within md, not md itself
  },
  {
    files: ["*.ts", "**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  },
  stylistic.configs["all-flat"],
  // https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts
  {
    rules: {
      "@stylistic/indent": ["error", 2],
      // punctuation
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": [
        "error", "double", { allowTemplateLiterals: true,
          avoidEscape: false },
      ],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/dot-location": ["error", "property"],
      // spacing
      "@stylistic/object-curly-spacing": ["error", "always"],
      // line breaks
      "@stylistic/array-bracket-newline": ["error", "consistent"],
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/object-property-newline": [
        "error",
        { allowAllPropertiesOnSameLine: true },
      ],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
      "@stylistic/multiline-ternary": ["error", "always-multiline"],
      // line padding
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "any", prev: "*", next: "*" },
      ],
    },
  },
];
