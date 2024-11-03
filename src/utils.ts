import { ESLintUtils } from "@typescript-eslint/utils";

export interface AlignEnumsDocs {
  description: "Aligns enum assignments by their value, or by the assignment operator";
}

export const createRule = ESLintUtils.RuleCreator<AlignEnumsDocs>(name => `https://github.com/bsian03/eslint-plugin-asign-enums/tree/main/docs/${name}.md`);
