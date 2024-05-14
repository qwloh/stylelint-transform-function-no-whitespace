<div align="center">

# transform-function-no-whitespace

Disallow whitespace between transform functions and their parentheses

For projects that would like to safeguard their transform functions when used with CSS, SCSS, or PostCSS variables.

</div>

<!-- to be added after the package is published -->
<!-- npm tag -->
<!-- coverage badge -->

## Problem

When there are whitespaces between tranform functions and their parentheses, browsers deemed them as invalid values for the CSS `transform` property.

<img src="asset/invalid_css.png" width="500">

Yet, two most common CSS formatters, VS Code's built-in CSS Language Features and Prettier, do not warn users when whitespaces are accidentally left in, nor remove them on format.

|VS Code's built-in CSS Language Features|
|:---|
|![CSS Language Feature Format Behavior](/asset/css-format-behavior.gif)|
|**Prettier**|
|![Prettier Format Behavior](/asset/prettier-format-behavior.gif)|

### Existing Stylelint Rule

Stylelint, on the other hand, can be configured to address this issue by turning on the rule `declaration-property-value-no-unknown`. But this rule is rather strict and forbidding, so it may not suit all projects (probably also why it is turned off by default). Especially if it is used solely for this purpose of catching whitespaces in transform functions; the configuration work needed to relax the rule where needed can become more than what the benefit is worth.

But more importantly, **the rule breaks when variables come into play** <sup id="see-behavior">[1, see behavior](#rule-limit)</sup>, whether it's native CSS variables or non-standard syntaxes like the dollar or hash variables commonly used by CSS pre- or post-processors like SCSS or PostCSS. This is particularly limiting as it is common to use variables when coding animations that is moderately complex, say, the staggered entrance of group elements, in which variables are used to control the delay between each element's entry.

It is posssible to make the rule work with these variables by messing with its configuration, that is, by providing a regex to `ignoreProperties.transform` in the rule's secondary option, to describe a new acceptable property value pattern for `transform` that accounts for the use of variables. But constructing such regex is not trivial, as `transform` takes value in a wide range of forms, ranging from non-functional keywords, like `none` and `initial`, to more than a dozen transform functions, which take varying number of arguments (consider `matrix3d()`, specified with 16 values, and `translateX()`, which accepts only one), and the combination of any number of these functions.

## Solution

[to be filled in]

## Installation

```shell
npm install --save-dev stylelint stylelint-transform-function-no-whitespace
```

## Setup

In `stylelint.config.js`, add the plugin and turn on its rule.

```js
// stylelint.config.js
/* ESM pattern is preferred, as CommonJS support will be deprecated
on Stylelint's next major release (17.0.0) */

export default {
  plugins: [
    // your other plugins
    "stylelint-transform-function-no-whitespace",
  ],
  rules: {
    // your other rules
    "plugin/transform-function-no-whitespace": true,
  },
};
```

<details>

<summary><h3>👋 For First-time Stylelint Users</h3></summary>

If you come from Prettier and are considering switching to Stylelint due to Prettier's limited configuration options, you first need to setup Stylelint on your project in order to use this plugin. You'll need four things, assuming you are using VS Code as your IDE:

1. `stylelint` installed as `devDependencies` on your project.
2. A `stylelint.config.js` in your project's root directory. I recommend starting with this config.
3. Install Stylelint's [official extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) in VS Code.
4. In VS Code's user or workspace settings, configure (a) the files Stylelint should validate, by providing the file extensions, and (b) VS Code to run Stylelint with `--fix` flag on save to get Prettier-like format-on-save behavior.

    ```jsonc
    {
      // default: ["css", "postcss"]
      "stylelint.validate": ["css", "postcss", "scss"];

      // unlike formatters which are usually set by `editor.defaultFormatter`
      // linters usually require `codeActionsOnSave` so that they could be run with the --fix flag
      "editor.codeActionsOnSave": {
        "source.fixAll.stylelint": "explicit"
      }
    }
    ```

    :bulb: It's always a good idea to **restart VS Code** after adding new configs to ensure that the latest settings are loaded.

</details>

## Usage

After updating `stylelint.config.js`, **restart VS Code**. You should now see warning lines under your code if you add spaces after your transform functions.

### Options

This plugin accepts a single boolean as its primary option  (`true` or `false`, which turns the rule on or off). There is no secondary configuration option.

### Autofix

When a rule supports autofix, Stylelint can apply fixes to the source code automatically when it is violated, i.e. performing what we called "formatting". When a rule doesn't, the editor raise errors as squiggly lines under the code, but no formatting will occur, and the user must resolve the error manually.

**This plugin does NOT support autofix**. If you need the plugin to not only raise errors, but also remove the whitespaces for you when you run your linting/formatting command, let me know by opening an issue.

## Footnotes

1. <small><span id="rule-limit">Limitations</span> of Stylelint's `declaration-property-value-no-unknown` [↩](#see-behavior)</small>

    |<small>**SCSS Variables**</small>|
    |:---|
    |![Stylelint Rule with SCSS Variables](/asset/stylelint-scss-var.gif)|
    |<small>**PostCSS Variables**</small>|
    |![Stylelint Rule with PostCSS Variables](/asset/stylelint-postcss-var.gif)|
    |<small>**Native CSS Variables**: Dangling transform functions that the rule would otherwise catch are ignored</small>|
    |![Stylelint Rule with CSS Variables](/asset/stylelint-css-var.gif)|

## LICENSE

[MIT](https://github.com/qwloh/stylelint-transform-function-no-whitespace/blob/main/LICENSE)
