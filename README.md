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
module.exports = {
  pages: {
    noPagePrefix({name}) {
      if (name.toLowerCase().indexOf('page') === 0) {
        return ['error', `Page name contains forbidden "page" prefix.`];
      }
    },
  },
  artboards: {
    noUnknownScreenSizes({frame: {width}}) {
      const screenSizes = {mobile: 400, desktop: 1200};
      if (!Object.values(screenSizes).includes(width)) {
        return ['warning', `Width "${width}" is not a known screen size.`];
      }
    },
  },
  groups: {
    maxLayers({layers}) {
      const layerCount = layers.length;
      if (layerCount > 10) {
        return [
          'warning',
          `More than 10 layers in a single group can lead to confusing hierarchies.`,
        ];
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
          return ['error', `Font "${font}" is not a brand font.`];
        }
      }
    },
  },
  layers: {
    noExclamationMark({attributedString}) {
      if (attributedString && attributedString.string.includes('!')) {
        return ['warning', `Exclamation marks are not recommended.`];
      }
    },
  },
  document: {
    textStyle({layerTextStyles: {objects: textStyles}}) {
      for (const {name} of textStyles) {
        if (name.match(/\s+/)) {
          return [
            'error',
            `Spaces are not allowed in text style names ("${name}").`,
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
error Page name contains forbidden "page" prefix. pages.noPagePrefix

meta
error Font "BrandonText-Bold" is not a brand font. meta.noCustomFonts

document
error Spaces are not allowed in text style names ("page title"). document.textStyle

homepage/v1/black box/title
warning Exclamation marks are not recommended. layers.noExclamationMark

homepage/v1/black box
warning More than 10 layers in a single group can lead to confusing hierarchies. groups.maxLayers
error Spaces are not allowed in group names. groups.noSpaces

page-about/v1
warning Width "350" is not a known screen size. artboards.noUnknownScreenSizes

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

const sketchData = fs.readFileSync(`${__dirname}/fixtures/basic.sketch`);
const lintingErrors = await sketchlint(sketchData, {
  pages: {
    noPagePrefix({name}) {
      if (name.toLowerCase().indexOf('page') === 0) {
        return ['error', `Page name contains forbidden "page" prefix.`];
      }
    },
  },
  artboards: {
    noUnknownScreenSizes({frame: {width}}) {
      const screenSizes = {mobile: 400, desktop: 1200};
      if (!Object.values(screenSizes).includes(width)) {
        return ['warning', `Width "${width}" is not a known screen size.`];
      }
    },
  },
  groups: {
    maxLayers({layers}) {
      const layerCount = layers.length;
      if (layerCount > 10) {
        return [
          'warning',
          `More than 10 layers in a single group can lead to confusing hierarchies.`,
        ];
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
          return ['error', `Font "${font}" is not a brand font.`];
        }
      }
    },
  },
  layers: {
    noExclamationMark({attributedString}) {
      if (attributedString && attributedString.string.includes('!')) {
        return ['warning', `Exclamation marks are not recommended.`];
      }
    },
  },
  document: {
    textStyle({layerTextStyles: {objects: textStyles}}) {
      for (const {name} of textStyles) {
        if (name.match(/\s+/)) {
          return [
            'error',
            `Spaces are not allowed in text style names ("${name}").`,
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
