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

But more importantly, **the rule breaks when variables come into play**[^1], whether it's native CSS variables or non-standard syntaxes like the dollar or hash variables commonly used by CSS pre- or post-processors like SCSS or PostCSS. This is particularly limiting as it is common to use variables when coding animations that is moderately complex, say, the staggered entrance of group elements, in which variables are used to control the delay between each element's entry.

It is posssible to make the rule work with these variables by messing with its configuration, that is, by providing a regex to `ignoreProperties.transform` in the rule's secondary option, to describe a new acceptable property value pattern for `transform` that accounts for the use of variables. But constructing such regex is not trivial, as `transform` takes value in a wide range of forms, ranging from non-functional keywords, like `none` and `initial`, to more than a dozen transform functions, which take varying number of arguments (consider `matrix3d()`, specified with 16 values, and `translateX()`, which accepts only one), and the combination of any number of these functions.

## Solution

[to be filled in]

## Installation

```shell
npm install --save-dev stylelint stylelint-transform-function-no-whitespace
```

## LICENSE

[MIT](https://github.com/qwloh/stylelint-transform-function-no-whitespace/blob/main/LICENSE)

## Footnotes

[^1]: Limitations of Stylelint's `declaration-property-value-no-unknown`
  |Native CSS variables|
  |---|
  |![Stylelint Rule with CSS Variables](/asset/stylelint-css-var.gif)|
  |**SCSS variables**|
  |![Stylelint Rule with SCSS Variables](/asset/stylelint-scss-var.gif)|
  |**PostCSS variables**|
  |![Stylelint Rule with PostCSS Variables](/asset/stylelint-postcss-var.gif)|
