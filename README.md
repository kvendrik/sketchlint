# Sketchlint 💎

Pluggable linting utility for Sketch.

Using Sketchlint you can enforce brand consistency across designs by defining a set of rules any Sketch file can be checked against.

## Usage

```
yarn add --global sketchlint
```

```js
// sketchlint.config.js
const validOptions = ['12px', '18px', '20px'];

export default [
  pages: {
    hasPagePrefix({name}) {
      if (!name.includes('Page')) {
        return ['error', `page "${name}" is missing the "Page" prefix`];
      }
    }
  },
  layers: {
    noCustomSize({fontSize}) {
      if (validOptions.includes(fontSize)) {
        return undefined;
      }
      return ['warning', `font size "${fontSize}" is not part of the type spec.`];
    },
    noExclamationMark({text}) {
      if (!text.includes('!')) {
        return undefined;
      }
      return ['error', `text "yeeyz!" may not contain an exclamation mark.`];
    },
    noCustomColor({backgroundColor}, {colors: documentColors}) {
      if (documentColors.includes(backgroundColor)) {
        return undefined;
      }
      return ['error', `color ${backgroundColor} is not part of the document colors`];
    },
  };
 },
]
```

```bash
sketchlint my-design.sketch --config sketchlint.config.js

homepage
  - page "homepage" is missing the "Page" prefix. (hasPagePrefix)
homepage/v1/title
  - error: text "yeeyz!" may not contain an exclamation mark. (noExclamationMark)
  - warning: font size "24px" is not part of the type spec. (noCustomSize)
homepage/v1/background
  - error: color #DA2171 is not part of the document colors (noCustomColor)
```
