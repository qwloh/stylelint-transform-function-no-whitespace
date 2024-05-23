import { describe, it, expect } from "vitest";

import stylelint from "stylelint15";
import { Config } from "stylelint15";
const { lint } = stylelint;

const config: Config = {
  plugins: ["./dist/index.cjs"],
  rules: { "plugin/transform-function-no-whitespace": true },
};

import pluginInTS, { TRANSFORM_FUNCTIONS, printRejectedMsg } from "../index.ts";

if (!("rule" in pluginInTS)) throw Error("Plugin does not have a member named 'rule'. Check that it is correctly imported in index.test.ts");

const {
  rule: { messages },
} = pluginInTS;

describe("Util `printRejectedMsg`", () => {

  it("should output warning with the correct transform function and col number", () => {

    const match = "skewX";
    const col = 30;
    expect(printRejectedMsg([{ match, col }]))
      .toBe(`Expected ${match} to be followed immediately by '(' <col ${col} at 'transform'>`);

  });

  it("should sort transform functions based on col number", () => {

    const matched = [
      { match: "scale3d", col: 7 },
      { match: "scale3d", col: 46 },
      { match: "rotate", col: 30 },
    ];
    const message = printRejectedMsg([...matched]); // use spread operator to prevent mutation of test stub
    expect(message, `Error! "${message}" is not sorted`).toBe(
      `Expected ${matched[0].match} to be followed immediately by '(' <col ${matched[0].col} at 'transform'>\n` +
      `Expected ${matched[2].match} to be followed immediately by '(' <col ${matched[2].col} at 'transform'>\n` +
      `Expected ${matched[1].match} to be followed immediately by '(' <col ${matched[1].col} at 'transform'>`,
    );

  });

});


it("Should not raise warning on valid values", async () => {

  const {
    results: [{ warnings }],
  } = await lint({ files: "./__tests__/validtransform.css", config }); // cwd of lint when running test is project's root dir

  expect(warnings)
    .toHaveLength(0);

});

describe("Warn when single transform function", () => {

  it.each(Object.keys(TRANSFORM_FUNCTIONS)
    .map((k) => ({ fn: k })))(
    "$fn not followed immediately by a parenthesis",
    async ({ fn }) => {

      const {
        results: [{ warnings }],
      } = await lint({
        code: `.foo { transform: ${fn} (); }`,
        config,
      });

      expect(warnings).not.toHaveLength(0);
      // @ts-ignore
      const warning = messages.rejected(
        printRejectedMsg([{ match: fn, col: fn.length }]),
      );
      expect(warnings[0].text).toBe(warning);

    },
  );

});

describe("Warn when multiple transform functions are used, and one is not followed immediately by a parenthesis, regardless if", () => {

  it("the violating function is the first", async () => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: scaleX (1.2rem) rotate(30deg); }`,
      config,
    });
    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg([{ match: "scaleX", col: 6 }]),
    );
    expect(warnings[0].text).toBe(warning);

  });
  it("the violating function is in the middle", async () => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: scaleX(1.2rem) translate (30px, 0) rotate(30deg); }`,
      config,
    });
    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg([{ match: "translate", col: 24 }]),
    );
    expect(warnings[0].text).toBe(warning);

  });
  it("the violating function is the last", async () => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: scaleX(1.2rem) skewY(10deg) rotate (30deg); }`,
      config,
    });
    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg([{ match: "rotate", col: 34 }]),
    );
    expect(warnings[0].text).toBe(warning);

  });

});

describe("Warn when", () => {

  it("multiple transform functions are used, and more than one are not followed immediately by parentheses", async () => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: scaleX (1.2rem) rotate (30deg) translateZ(1rem); }`,
      config,
    });
    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg([
        { match: "scaleX", col: 6 },
        { match: "rotate", col: 22 },
      ]),
    );
    expect(warnings[0].text).toBe(warning);

  });

  it("repeated transform functions are used, and more than one instances of the same transform function are not followed immediately by parentheses", async () => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: scale3d (1.3, 1.3, 1.3) rotate(30deg) scale3d (0.5, 0.5, -0.4); }`,
      config,
    });
    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg([
        { match: "scale3d", col: 7 },
        { match: "scale3d", col: 45 },
      ]),
    );
    expect(warnings[0].text).toBe(warning);

  });

  it("multiple trasnform functions, some repeating, are not followed immediately by parentheses", async () => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: scale3d (1.3, 1.3, 1.3) rotate (30deg) scale3d (0.5, 0.5, -0.4); }`,
      config,
    });
    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg([
        { match: "scale3d", col: 7 },
        { match: "scale3d", col: 46 },
        { match: "rotate", col: 30 },
      ]),
    );
    expect(warnings[0].text).toBe(warning);

  });

});

// native css
describe("Warn when CSS-variables-using transform function", () => {

  it.each([
    // space in transform function that uses variables
    {
      desc: "is the first and dangling",
      testStr: "matrix (var(--scale-x),2,3,4,5,6) rotate(0.5turn) skewY(1.07rad)",
      matches: [{ match: "matrix", col: 6 }],
    },
    {
      desc: "is in the middle and dangling",
      testStr: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) translateY (var(--translate-y)) scale(2, 0.5)",
      matches: [{ match: "translateY", col: 67 }],
    },
    {
      desc: "is the last and dangling",
      testStr: "perspective(17px) rotateX(10deg) scaleZ (var(--scale-z))",
      matches: [{ match: "scaleZ", col: 39 }],
    },
    // space in transform function that doesn't use variables but others do
    {
      desc: "is the first and fine but one other is dangling",
      testStr: "rotate3d(1, 2, 3, var(--rotate3d-angle)) translate (12px, 50%) skew(30deg, 20deg)",
      matches: [{ match: "translate", col: 50 }],
    },
    {
      desc: "is in the middle and fine but one other is dangling",
      testStr: "translateX (2em) scale3d(2.5, var(--scale-y), 0.3) skewX(30deg)",
      matches: [{ match: "translateX", col: 10 }],
    },
    {
      desc: "is the last and fine but one other is dangling",
      testStr: "translate3d(12px, 50%, 3em) rotateY (10deg) scaleX(var(--scale-x))",
      matches: [{ match: "rotateY", col: 35 }],
    },
    // multiple dangling variable-using transform functions
    {
      desc: "(s) are dangling",
      testStr: "rotateZ (var(--rotate-Z)) scaleY(0.5) translateZ (var(--translate-Z))",
      matches: [{ match: "rotateZ", col: 7 }, { match: "translateZ", col: 48 }],
    },
    // there are both variableless and variable-using dangling transform functions
    {
      desc: "as well as another variableless one are dangling",
      testStr: "rotateX(var(--rotate-x)) skew (30deg, var(--skew-y)) translateY (3in)",
      matches: [{ match: "skew", col: 29 }, { match: "translateY", col: 63 }],
    },
  ])("$desc", async ({ testStr, matches }) => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: ${testStr}; }`,
      config,
    });

    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg(matches),
    );
    expect(warnings[0].text).toBe(warning);

  });

});

// dollar variables

describe("Warn when $-variables-using transform function", () => {

  it.each([
    // space in transform function that uses variables
    {
      desc: "is the first and dangling",
      testStr: "matrix ($scale-x,2,3,4,5,6) rotate(0.5turn) skewY(1.07rad)",
      matches: [{ match: "matrix", col: 6 }],
    },
    {
      desc: "is in the middle and dangling",
      testStr: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) translateY ($translate-y) scale(2, 0.5)",
      matches: [{ match: "translateY", col: 67 }],
    },
    {
      desc: "is the last and dangling",
      testStr: "perspective(17px) rotateX(10deg) scaleZ ($scale-z)",
      matches: [{ match: "scaleZ", col: 39 }],
    },
    // space in transform function that doesn't use variables but others do
    {
      desc: "is the first and fine but one other is dangling",
      testStr: "rotate3d(1, 2, 3, $rotate3d-angle) translate (12px, 50%) skew(30deg, 20deg)",
      matches: [{ match: "translate", col: 44 }],
    },
    {
      desc: "is in the middle and fine but one other is dangling",
      testStr: "translateX (2em) scale3d(2.5, $scale-y, 0.3) skewX(30deg)",
      matches: [{ match: "translateX", col: 10 }],
    },
    {
      desc: "is the last and fine but one other is dangling",
      testStr: "translate3d(12px, 50%, 3em) rotateY (10deg) scaleX($scale-x)",
      matches: [{ match: "rotateY", col: 35 }],
    },
    // multiple dangling variable-using transform functions
    {
      desc: "(s) are dangling",
      testStr: "rotateZ ($rotate-Z) scaleY(0.5) translateZ ($translate-Z)",
      matches: [{ match: "rotateZ", col: 7 }, { match: "translateZ", col: 42 }],
    },
    // there are both variableless and variable-using dangling transform functions
    {
      desc: "as well as another variableless one are dangling",
      testStr: "rotateX($rotate-x) skew (30deg, $skew-y) translateY (3in)",
      matches: [{ match: "skew", col: 23 }, { match: "translateY", col: 51 }],
    },
  ])("$desc", async ({ testStr, matches }) => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: ${testStr}; }`,
      config,
    });

    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg(matches),
    );
    expect(warnings[0].text).toBe(warning);

  });

});

// dollar variables with brackets

describe("Warn when $()-variables-using transform function", () => {

  it.each([
    // space in transform function that uses variables
    {
      desc: "is the first and dangling",
      testStr: "matrix ($(scale-x),2,3,4,5,6) rotate(0.5turn) skewY(1.07rad)",
      matches: [{ match: "matrix", col: 6 }],
    },
    {
      desc: "is in the middle and dangling",
      testStr: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) translateY ($(translate-y)) scale(2, 0.5)",
      matches: [{ match: "translateY", col: 67 }],
    },
    {
      desc: "is the last and dangling",
      testStr: "perspective(17px) rotateX(10deg) scaleZ ($(scale-z))",
      matches: [{ match: "scaleZ", col: 39 }],
    },
    // space in transform function that doesn't use variables but others do
    {
      desc: "is the first and fine but one other is dangling",
      testStr: "rotate3d(1, 2, 3, $(rotate3d-angle)) translate (12px, 50%) skew(30deg, 20deg)",
      matches: [{ match: "translate", col: 46 }],
    },
    {
      desc: "is in the middle and fine but one other is dangling",
      testStr: "translateX (2em) scale3d(2.5, $(scale-y), 0.3) skewX(30deg)",
      matches: [{ match: "translateX", col: 10 }],
    },
    {
      desc: "is the last and fine but one other is dangling",
      testStr: "translate3d(12px, 50%, 3em) rotateY (10deg) scaleX($(scale-x))",
      matches: [{ match: "rotateY", col: 35 }],
    },
    // multiple dangling variable-using transform functions
    {
      desc: "(s) are dangling",
      testStr: "rotateZ ($(rotate-Z)) scaleY(0.5) translateZ ($(translate-Z))",
      matches: [{ match: "rotateZ", col: 7 }, { match: "translateZ", col: 44 }],
    },
    // there are both variableless and variable-using dangling transform functions
    {
      desc: "as well as another variableless one are dangling",
      testStr: "rotateX($(rotate-x)) skew (30deg, $(skew-y)) translateY (3in)",
      matches: [{ match: "skew", col: 25 }, { match: "translateY", col: 55 }],
    },
  ])("$desc", async ({ testStr, matches }) => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: ${testStr}; }`,
      config,
    });

    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg(matches),
    );
    expect(warnings[0].text).toBe(warning);

  });

});

// hash variables with curly brackets
describe("Warn when #{$}-variables-using transform function", () => {

  it.each([
    // space in transform function that uses variables
    {
      desc: "is the first and dangling",
      testStr: "matrix (#{$scale-x},2,3,4,5,6) rotate(0.5turn) skewY(1.07rad)",
      matches: [{ match: "matrix", col: 6 }],
    },
    {
      desc: "is in the middle and dangling",
      testStr: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) translateY (#{$translate-y}) scale(2, 0.5)",
      matches: [{ match: "translateY", col: 67 }],
    },
    {
      desc: "is the last and dangling",
      testStr: "perspective(17px) rotateX(10deg) scaleZ (#{$scale-z})",
      matches: [{ match: "scaleZ", col: 39 }],
    },
    // space in transform function that doesn't use variables but others do
    {
      desc: "is the first and fine but one other is dangling",
      testStr: "rotate3d(1, 2, 3, #{$rotate3d-angle}) translate (12px, 50%) skew(30deg, 20deg)",
      matches: [{ match: "translate", col: 47 }],
    },
    {
      desc: "is in the middle and fine but one other is dangling",
      testStr: "translateX (2em) scale3d(2.5, #{$scale-y}, 0.3) skewX(30deg)",
      matches: [{ match: "translateX", col: 10 }],
    },
    {
      desc: "is the last and fine but one other is dangling",
      testStr: "translate3d(12px, 50%, 3em) rotateY (10deg) scaleX(#{$scale-x})",
      matches: [{ match: "rotateY", col: 35 }],
    },
    // multiple dangling variable-using transform functions
    {
      desc: "(s) are dangling",
      testStr: "rotateZ (#{$rotate-Z}) scaleY(0.5) translateZ (#{$translate-Z})",
      matches: [{ match: "rotateZ", col: 7 }, { match: "translateZ", col: 45 }],
    },
    // there are both variableless and variable-using dangling transform functions
    {
      desc: "as well as another variableless one are dangling",
      testStr: "rotateX(#{$rotate-x}) skew (30deg, #{$skew-y}) translateY (3in)",
      matches: [{ match: "skew", col: 26 }, { match: "translateY", col: 57 }],
    },
  ])("$desc", async ({ testStr, matches }) => {

    const {
      results: [{ warnings }],
    } = await lint({
      code: `.foo { transform: ${testStr}; }`,
      config,
    });

    expect(warnings).not.toHaveLength(0);
    // @ts-ignore
    const warning = messages.rejected(
      printRejectedMsg(matches),
    );
    expect(warnings[0].text).toBe(warning);

  });

});
