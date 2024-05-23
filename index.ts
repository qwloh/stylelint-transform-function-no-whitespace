import stylelint, { Rule } from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

// Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function
export const TRANSFORM_FUNCTIONS = {
  matrix: /matrix\s/g,
  matrix3d: /matrix3d\s/g,
  perspective: /perspective\s/g,
  rotate: /rotate\s/g,
  rotate3d: /rotate3d\s/g,
  rotateX: /rotateX\s/g,
  rotateY: /rotateY\s/g,
  rotateZ: /rotateZ\s/g,
  scale: /scale\s/g,
  scale3d: /scale3d\s/g,
  scaleX: /scaleX\s/g,
  scaleY: /scaleY\s/g,
  scaleZ: /scaleZ\s/g,
  skew: /skew\s/g,
  skewX: /skewX\s/g,
  skewY: /skewY\s/g,
  translate: /translate\s/g,
  translate3d: /translate3d\s/g,
  translateX: /translateX\s/g,
  translateY: /translateY\s/g,
  translateZ: /translateZ\s/g,
};

const TRANSFORM_FUNCTIONS_REGEX_ARR = Object.values(TRANSFORM_FUNCTIONS);

const ruleName = "plugin/transform-function-no-whitespace";

export const printRejectedMsg = (matches: { match: string; col: number }[]): string => matches
  .sort((ma, mb) => ma.col - mb.col)
  .map((m) => `Expected ${m.match} to be followed immediately by '(' <col ${m.col} at 'transform'>`)
  .join("\n");

const messages = ruleMessages(ruleName, {
  rejected: (rejectedMsg: string) => rejectedMsg,
});

const meta = {
  url: "https://github.com/qwloh/stylelint-transform-function-no-whitespace#readme",
};

const ruleFunction: Rule<boolean> = (primary, secondaryOptions, context) => {

  return (root, result) => {

    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkDecls("transform", (decl) => {

      const matches: RegExpExecArray[] = [];

      TRANSFORM_FUNCTIONS_REGEX_ARR.forEach((regex) => {

        const match = [...decl.value.matchAll(regex)];
        matches.push(...match);

      });

      if (!matches.length) return;

      report({
        result,
        ruleName,
        message: messages.rejected(
          printRejectedMsg(matches.map((m) => ({ match: m[0].trim(), col: m.index + m[0].length - 1 }))),
        ),
        node: decl,
      });

    });

  };

};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
