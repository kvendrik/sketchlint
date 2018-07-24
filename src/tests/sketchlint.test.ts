import * as fs from 'fs';
import sketchlint, {Page, Layer} from '../';

const RULES = {
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
};

const sketchData = fs.readFileSync(`${__dirname}/fixtures/basic.sketch`);

describe('sketchlint', () => {
  it('do the thing', async () => {
    const results = await sketchlint(sketchData, RULES);
    console.log('RESULTS', results);
  });
});
