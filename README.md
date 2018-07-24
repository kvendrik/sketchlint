# [WIP] Sketchlint 💎

Pluggable linting utility for Sketch.

Using Sketchlint you can enforce brand consistency across designs by defining a set of rules any Sketch file can be checked against.

![Demo](demo.gif)

## Usage (CLI)

```
yarn add --global sketchlint
```

```js
// sketchlint.config.js
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

```bash
sketchlint my-design.sketch --config sketchlint.config.js

page-about
  error Page name "page-about" contains forbidden "page" prefix. noPagePrefix

homepage/v1/box/title
  warning text "Yeey!" may not contain an exclamation mark. noExclamationMark

✖ 2 problems (1 error, 1 warning)
```

## Usage (Node)

```
yarn add sketchlint
```

```ts
import fs from 'fs';
import sketchlint, {Page, Layer} from '../';

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
