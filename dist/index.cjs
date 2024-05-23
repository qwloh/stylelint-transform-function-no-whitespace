"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    TRANSFORM_FUNCTIONS: function() {
        return TRANSFORM_FUNCTIONS;
    },
    default: function() {
        return _default;
    },
    printRejectedMsg: function() {
        return printRejectedMsg;
    }
});
const _stylelint = _interop_require_default(require("stylelint"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { createPlugin, utils: { report, ruleMessages, validateOptions } } = _stylelint.default;
const TRANSFORM_FUNCTIONS = {
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
    translateZ: /translateZ\s/g
};
const TRANSFORM_FUNCTIONS_REGEX_ARR = Object.values(TRANSFORM_FUNCTIONS);
const ruleName = "plugin/transform-function-no-whitespace";
const printRejectedMsg = (matches)=>matches.sort((ma, mb)=>ma.col - mb.col).map((m)=>`Expected ${m.match} to be followed immediately by '(' <col ${m.col} at 'transform'>`).join("\n");
const messages = ruleMessages(ruleName, {
    rejected: (rejectedMsg)=>rejectedMsg
});
const meta = {
    url: "https://github.com/qwloh/stylelint-transform-function-no-whitespace#readme"
};
const ruleFunction = (primary, secondaryOptions, context)=>{
    return (root, result)=>{
        const validOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [
                true
            ]
        });
        if (!validOptions) return;
        root.walkDecls("transform", (decl)=>{
            const matches = [];
            TRANSFORM_FUNCTIONS_REGEX_ARR.forEach((regex)=>{
                const match = [
                    ...decl.value.matchAll(regex)
                ];
                matches.push(...match);
            });
            if (!matches.length) return;
            report({
                result,
                ruleName,
                message: messages.rejected(printRejectedMsg(matches.map((m)=>({
                        match: m[0].trim(),
                        col: m.index + m[0].length - 1
                    })))),
                node: decl
            });
        });
    };
};
ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;
const _default = createPlugin(ruleName, ruleFunction);

