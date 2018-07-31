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
