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
        return [
          'error',
          `Page name "${name}" contains forbidden "page" prefix.`,
        ];
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
};
```

Now run Sketchlint against any ([v43+](https://sketchplugins.com/d/87-new-file-format-in-sketch-43)) Sketch file and it will make sure it complies with your rules. Here we run Sketchlint against a Sketch file called `my-design.sketch`:

```bash
sketchlint my-design.sketch --config sketchlint.config.js

page-about
  error Page name "page-about" contains forbidden "page" prefix. noPagePrefix

homepage/v1/box/title
  warning text "Yeey!" may not contain an exclamation mark. noExclamationMark

✖ 2 problems (1 error, 1 warning)
```

## Getting Started (Node)

Install Sketchlint using [`yarn`](https://yarnpkg.com/en/package/sketchlint):

```
yarn add sketchlint
```

Now run Sketchlint against any ([v43+](https://sketchplugins.com/d/87-new-file-format-in-sketch-43)) Sketch file and it will check if the file complies with the given set of rules and give back an array of linting errors (if there are any).

```ts
import fs from 'fs';
import sketchlint, {Page, Layer} from 'sketchlint';

const sketchData = fs.readFileSync(`${__dirname}/fixtures/basic.sketch`);
const lintingErrors = await sketchlint(sketchData, {
  pages: {
    noPagePrefix({name}: Page) {
      if (name.toLowerCase().indexOf('page') === 0) {
        return [
          'error',
          `Page name "${name}" contains forbidden "page" prefix.`,
        ];
      }
    },
  },
  layers: {
    noExclamationMark({attributedString}: Layer) {
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
});

console.log(lintingErrors);
```

## 🏗 Contributing

1.  Make your changes.
2.  Add/Alter the appropriate tests.
3.  Make sure all tests pass (`yarn lint && yarn test`).
4.  Create a PR.
