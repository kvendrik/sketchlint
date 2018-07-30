# Sketchlint

[![CircleCI](https://circleci.com/gh/kvendrik/sketchlint.svg?style=svg)](https://circleci.com/gh/kvendrik/sketchlint)
[![Coverage Status](https://coveralls.io/repos/github/kvendrik/sketchlint/badge.svg?branch=master)](https://coveralls.io/github/kvendrik/sketchlint?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

💎 Pluggable linting utility for Sketch.

Sketchlint allows you to enforce brand consistency across designs by defining a set of rules any Sketch file can be checked against.

<img src="https://github.com/kvendrik/sketchlint/raw/master/demo.gif" width="100%" />

## Getting Started (CLI)

Install Sketchlint using [`yarn`](https://yarnpkg.com/en/package/sketchlint):

```
yarn global add sketchlint
```

Then, create a file named `sketchlint.config.js`. This will contain our rules:

```js
const Color = require('color');

module.exports = {
  pages: {
    noPagePrefix({name}) {
      if (name.toLowerCase().indexOf('page') === 0) {
        return [
          'error',
          `Page name "${name}" contains forbidden "page" prefix.`,
        ];
      }
    },
  },
  artboards: {
    noCapitalization({name}) {
      if (/^[A-Z]/.test(name)) {
        return [
          'warning',
          `Capitalization of artboard names is not recommended.`,
        ];
      }
    },
  },
  groups: {
    noUnderscore({name}) {
      if (name.includes('_')) {
        return ['error', `Underscores are not allowed in group names.`];
      }
    },
    noSpaces({name}) {
      if (name.match(/\s+/)) {
        return ['error', `Spaces are not allowed in group names.`];
      }
    },
  },
  meta: {
    noCustomFonts({fonts}) {
      const allowedFonts = ['Arial'];
      for (const font of fonts) {
        if (!allowedFonts.includes(font)) {
          return [
            'error',
            `Font "${font}" is not allowed. Please only use on-brand font families.`,
          ];
        }
      }
    },
  },
  layers: {
    noExclamationMark({attributedString}) {
      if (attributedString && attributedString.string.includes('!')) {
        return [
          'warning',
          `text "${
            attributedString.string
          }" may not contain an exclamation mark.`,
        ];
      }
    },
  },
  document: {
    noCustomDocumentColors({assets: {colors}}) {
      const brandColors = ['#000000', '#01689b'];

      for (const {red, green, blue} of colors) {
        const hexColor = Color.rgb(red * 255, green * 255, blue * 255).hex();
        if (!brandColors.includes(hexColor)) {
          return [
            'warning',
            `Document color ${hexColor} is not a brand color.`,
          ];
        }
      }
    },
  },
};
```

Now run Sketchlint against any ([v43+](https://sketchplugins.com/d/87-new-file-format-in-sketch-43)) Sketch file and it will make sure it complies with your rules. Here we run Sketchlint against a Sketch file called `my-design.sketch`:

```
sketchlint my-design.sketch --config sketchlint.config.js

page-about
error Page name "page-about" contains forbidden "page" prefix. pages.noPagePrefix

meta
error Font "BrandonText-Bold" is not allowed. Please only use on-brand font families. meta.noCustomFonts

document
warning Document color #4545C4 is not a brand color. document.noCustomDocumentColors

homepage/V1/_black box/title
warning text "Yeey!" may not contain an exclamation mark. layers.noExclamationMark

homepage/V1/_black box
error Underscores are not allowed in group names. groups.noUnderscore
error Spaces are not allowed in group names. groups.noSpaces

homepage/V1
warning Capitalization of artboard names is not recommended. artboards.noCapitalization

✖ 7 problems (4 errors, 3 warnings)
```

## Getting Started (Node)

Install Sketchlint using [`yarn`](https://yarnpkg.com/en/package/sketchlint):

```
yarn add sketchlint
```

Now run Sketchlint against any ([v43+](https://sketchplugins.com/d/87-new-file-format-in-sketch-43)) Sketch file and it will check if the file complies with the given set of rules and give back an array of linting errors (if there are any).

```ts
import fs from 'fs';
import sketchlint from 'sketchlint';
import Color from 'color';

const sketchData = fs.readFileSync(`${__dirname}/fixtures/basic.sketch`);
const lintingErrors = await sketchlint(sketchData, {
  pages: {
    noPagePrefix({name}) {
      if (name.toLowerCase().indexOf('page') === 0) {
        return [
          'error',
          `Page name "${name}" contains forbidden "page" prefix.`,
        ];
      }
    },
  },
  artboards: {
    noCapitalization({name}) {
      if (/^[A-Z]/.test(name)) {
        return [
          'warning',
          `Capitalization of artboard names is not recommended.`,
        ];
      }
    },
  },
  groups: {
    noUnderscore({name}) {
      if (name.includes('_')) {
        return ['error', `Underscores are not allowed in group names.`];
      }
    },
    noSpaces({name}) {
      if (name.match(/\s+/)) {
        return ['error', `Spaces are not allowed in group names.`];
      }
    },
  },
  meta: {
    noCustomFonts({fonts}) {
      const allowedFonts = ['Arial'];
      for (const font of fonts) {
        if (!allowedFonts.includes(font)) {
          return [
            'error',
            `Font "${font}" is not allowed. Please only use on-brand font families.`,
          ];
        }
      }
    },
  },
  layers: {
    noExclamationMark({attributedString}) {
      if (attributedString && attributedString.string.includes('!')) {
        return [
          'warning',
          `text "${
            attributedString.string
          }" may not contain an exclamation mark.`,
        ];
      }
    },
  },
  document: {
    noCustomDocumentColors({assets: {colors}}) {
      const brandColors = ['#000000', '#01689b'];

      for (const {red, green, blue} of colors) {
        const hexColor = Color.rgb(red * 255, green * 255, blue * 255).hex();
        if (!brandColors.includes(hexColor)) {
          return [
            'warning',
            `Document color ${hexColor} is not a brand color.`,
          ];
        }
      }
    },
  },
});

console.log(lintingErrors);
```

## 🏗 Contributing

1.  Make your changes.
2.  Add/Alter the appropriate tests.
3.  Make sure all tests pass (`yarn lint && yarn test`).
4.  Create a PR.
