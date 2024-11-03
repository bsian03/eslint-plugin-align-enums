import { TSESLint } from "@typescript-eslint/utils";
import { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";

const report = (context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>, enumName: string, editRangeBefore: TSESTree.Range, start: TSESTree.Position, end: TSESTree.Position, diff: number, messageId: string) => {
  context.report({
    loc: {
      start,
      end,
    },
    messageId,
    data: {
      enum: enumName,
    },
    fix: (fixer) => {
      if (diff > 0) {
        return fixer.removeRange([
          editRangeBefore[0] - diff,
          editRangeBefore[0],
        ]);
      }
      return fixer.insertTextBeforeRange(
        editRangeBefore,
        " ".repeat(-diff),
      );
    },
  });
};

export default createRule({
  meta: {
    docs: {
      description: "Aligns enum assignments by their value, or by the assignment operator",
    },
    messages: {
      extraValue: "Extra space before value for enum '{{enum}}'.",
      missingValue: "Missing space before value for enum '{{enum}}'.",
      extraEnum: "Extra space after enum '{{enum}}'.",
      missingEnum: "Missing space after enum '{{enum}}'.",
    },
    schema: [
      {
        type: "object",
        properties: {
          beforeEqual: { type: "boolean" },
          afterEqual: { type: "boolean" },
          align: { type: "string", enum: ["equals", "value"] },
        },
        additionalProperties: false,
      },
    ],
    type: "layout",
    fixable: "whitespace",
  },
  name: "align-enums",
  defaultOptions: [
    {
      beforeEqual: true,
      afterEqual: true,
      align: "equals",
    },
  ],
  create(context, [options]) {
    return {
      TSEnumDeclaration(node) {
        const alignBy = options.align;
        const spaceBefore = options.beforeEqual;
        const spaceAfter = options.afterEqual;

        const maxKeyLength = node.body.members.reduce((max, member) => {
          return Math.max(max, member.id.range[1] - member.id.range[0]);
        }, 0);

        node.body.members.forEach((member) => {
          if (!member.initializer) return;
          const key = member.id;
          if (key.type !== "Identifier") return;
          const source = context.sourceCode;

          // Calculate where = should be
          let expectedEqualPos = Number(spaceBefore) + key.range[1];
          if (alignBy === "equals") expectedEqualPos += maxKeyLength - key.name.length;

          const equalToken = source.getTokenAfter(member.id)!;
          const actualEqualPos = equalToken.range[0];
          const diffEqual = actualEqualPos - expectedEqualPos;

          if (diffEqual !== 0) {
            const message = diffEqual > 0 ? "extraEnum" : "missingEnum";
            report(context, key.name, equalToken.range, key.loc.end, equalToken.loc.start, diffEqual, message);
          }

          // Calculate how many spaces after =
          let expectedAfter = Number(spaceAfter);
          if (alignBy === "value") expectedAfter += maxKeyLength - key.name.length;

          const value = member.initializer!;
          const actualAfter = value.range[0] - equalToken.range[1];
          const diffAfter = actualAfter - expectedAfter;

          if (diffAfter !== 0) {
            const message = diffAfter > 0 ? "extraValue" : "missingValue";
            report(context, key.name, value.range, equalToken.loc.end, value.loc.start, diffAfter, message);
          }
        });
      },
    };
  },
});
