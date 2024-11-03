// @ts-check

import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tslint.config(
  eslint.configs.recommended,
  ...tslint.configs.recommended,
  stylistic.configs["recommended-flat"],
  {
    rules: {
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/member-delimiter-style": ["error", {
        multiline: {
          delimiter: "semi",
        },
      }],
    },
  },
  {
    ignores: ["dist/*"],
  },
);
