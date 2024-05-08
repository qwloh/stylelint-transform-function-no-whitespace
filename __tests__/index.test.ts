import stylelint from "stylelint";
import { Config } from "stylelint";
const { lint } = stylelint;

const config: Config = {
  plugins: ["./dist/index.js"],
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
      .toBe(`Expected ${match}to be followed immediately by '(' (col ${col} at 'transform')\n`);

  });

  it("should sort transform functions based on col number", () => {

    const matched = [
      { match: "scale3d ", col: 7 },
      { match: "scale3d ", col: 46 },
      { match: "rotate ", col: 30 },
    ];
    const message = printRejectedMsg([...matched]); // use spread operator to prevent mutation of test stub
    expect(message, `Error! "${message}" is not sorted`).toBe(
      `Expected ${matched[0].match}to be followed immediately by '(' (col ${matched[0].col} at 'transform')\n`+
      `Expected ${matched[2].match}to be followed immediately by '(' (col ${matched[2].col} at 'transform')\n` +
      `Expected ${matched[1].match}to be followed immediately by '(' (col ${matched[1].col} at 'transform')\n`,
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
        printRejectedMsg([{ match: `${fn} `, col: fn.length }]),
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
      printRejectedMsg([{ match: "scaleX ", col: 6 }]),
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
      printRejectedMsg([{ match: "translate ", col: 24 }]),
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
      printRejectedMsg([{ match: "rotate ", col: 34 }]),
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
        { match: "scaleX ", col: 6 },
        { match: "rotate ", col: 22 },
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
        { match: "scale3d ", col: 7 },
        { match: "scale3d ", col: 45 },
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
        { match: "scale3d ", col: 7 },
        { match: "scale3d ", col: 46 },
        { match: "rotate ", col: 30 },
      ]),
    );
    expect(warnings[0].text).toBe(warning);

  });

});


