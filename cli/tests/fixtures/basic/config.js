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
