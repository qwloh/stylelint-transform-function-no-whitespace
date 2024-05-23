# transform-function-no-whitespace

> Disallow whitespace between transform functions and their parentheses

![Build](https://img.shields.io/github/actions/workflow/status/qwloh/stylelint-transform-function-no-whitespace/npm-publish.yml)
![Last Commit](https://img.shields.io/github/last-commit/qwloh/stylelint-transform-function-no-whitespace)

For projects that would like to safeguard their transform functions when used with CSS, SCSS, or PostCSS variables.

![My plugin](/readme_assets/demo/my-plugin.gif)

## Installation

```shell
npm i -D stylelint stylelint-transform-function-no-whitespace
```

## Setup

```js
// stylelint.config.js
/* ESM pattern is preferred, as CommonJS support will be deprecated
in Stylelint's next major release (17.0.0) */

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

## Documentation

Please refer to [GitHub README](https://github.com/qwloh/stylelint-transform-function-no-whitespace#readme) for full documentation.
