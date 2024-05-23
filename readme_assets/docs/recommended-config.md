# Recommended Stylelint Starting Config

All Stylelint's rules are turned off by default. To get started quickly, extend presets that turn on a predefined set of rules for you.

Here are the presets that are recommended for **minimal intrusion** on an existing project:

> The configs are written for Stylelint 16. If you must use Stylelint 15, see [Pt. 2 of Discussion (Opt.)](#discussion-pt-2).

**If you use CSS or PostCSS**,

Install the following presets:

```shell
npm i -D stylelint stylelint-config-recommended @stylistic/stylelint-config
```

And use the following starting config:

```js
// stylelint.config.js
export default {
  extends: [
    "stylelint-config-recommended",
    "@stylistic/stylelint-config",
  ],
  plugins: [],
  rules: {},
};
```

**If you use SCSS**,

Install these presets instead:

```shell
npm i -D stylelint stylelint-config-recommended-scss @stylistic/stylelint-config
```

And use the following starting config:

```js
// stylelint.config.js
export default {
  extends: [
    "stylelint-config-recommended-scss",
    "@stylistic/stylelint-config",
  ],
  plugins: [],
  rules: {},
};
```

You may now move on with the rest of the setup. Below is an optional discussion for those who are interested in knowing a bit more about why these configs are recommended.

***

### Discusssion (Opt.)

1. There are several flavors of presets out there. But here's a quick summary on how they relate to each other:

    **CSS or PostCSS**

    * There are mainly two options: [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended#readme) and [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard#readme).

        `stylelint-config-recommended` is the pared down version of `stylelint-config-standard`, focusing only on rules that help developers *avoid errors* and leaving out convention-enforcing rules, such as those which enforce the casing of variable, function, or keyframe names.

        As such, it is easier to integrate with existing projects, allowing developers to get started with Stylelint without first having to resolve the conflicting styles between the existing code and the newly introduced Stylelint rules.

        Once you are comfortable with Stylelint, you may revisit the presets and try out the `-standard` variant to see if it suits your project better.

    * [`@stylistic/stylelint-config`](https://github.com/stylelint-stylistic/stylelint-config#readme ) is needed because Stylelint has deprecated its stylistic rules as part of the web dev community's general movement towards a cleaner separation of responsibility between linters and formatters. As a result, the stylistic rules have been moved to this new project to be maintained and updated as separate work.

        This preset uses [`@stylistic/stylelint-plugin`](https://github.com/stylelint-stylistic/stylelint-stylistic#readme) under the hood, which is the plugin that holds these stylistic rules now.

    **SCSS**

    * Similarly, [`stylelint-config-recommended-scss`](https://github.com/stylelint-scss/stylelint-config-recommended-scss#readme) is the lean version of [`stylelint-config-standard-scss`](https://github.com/stylelint-scss/stylelint-config-standard-scss#readme).

        If you are starting a blank project, `stylelint-config-standard-scss` is recommended.

        Both config extends their CSS counterparts: `stylelint-config-recommended-scss` extends `stylelint-config-recommended`, and `stylelint-config-standard-scss` extends `stylelint-config-standard`. So if either SCSS config is used, there is no need to include its CSS counterpart again.

        You may also come across [`stylelint-scss`](https://github.com/stylelint-scss/stylelint-scss#readme), which is not a preset but a plugin that provides *additional rules* specific to SCSS. In fact, it is included and used by both scss presets above. The docs advises against using this plugin directly unless you are building your own config from scratch.

    * `@stylistic/stylelint-config` is still needed.

    **Note on Prettier**

    There is technically a [`stylelint-prettier`](https://github.com/prettier/stylelint-prettier#readme) plugin that runs Prettier as a Stylelint rule. However, assuming Prettier's limited configuration choice is what drives your switch to Stylelint in the first place, here `@stylistic/stylelint-config` is recommended over `stylelint-prettier`. This is because [the rules in `@stylistic/stylelint-config`](https://github.com/stylelint-stylistic/stylelint-stylistic/blob/main/docs/user-guide/rules.md#general--sheet) address most that is configurable via Prettier -- indentation, print width, etc., while providing more CSS-specific formatting options.

2. For `stylelint.config.js`, it is recommended to use ESM pattern over CommonJS pattern, as it is announced that Stylelint's next major release (17.0.0) will drop support for CommonJS API.

    ```js
    // ESM pattern
    export default {

    };

    // CommonJS pattern (Do not use, unless you have to use Stylelint@^15)
    module.exports = {
    
    };
    ```

    <span id="discussion-pt-2">However, if you must use Stylelint 15, setup the config in CommonJS pattern (`module.exports`).</span>

3. Although Stylelint still accepts config written in JSON or YML format (`.stylelintrc.json`, `.stylelintrc.yml`, or `.stylelintrc.yaml`), [ESLint has deprecated support for `.eslintrc`](https://eslint.org/docs/latest/use/configure/configuration-files). The community seems to be converging towards `*.config.js` as the future standard.
