import * as fs from 'fs';
import {Layer, ValidatorError} from '../../../';

export function noExclamationMark({attributedString}: Layer): ValidatorError {
  if (attributedString && attributedString.string.includes('!')) {
    return [
      'warning',
      `text "${attributedString.string}" may not contain an exclamation mark.`,
    ];
  }
}

export const sketchData = fs.readFileSync(
  `${__dirname}/nested-exclamation-mark.sketch`,
);
