import * as fs from 'fs';
import {Layer, ValidatorError} from '../../../';

export const sketchData = fs.readFileSync(`${__dirname}/groups.sketch`);

export function noCapitalizedGroupNames({name}: Layer): ValidatorError {
  if (/^[A-Z]/.test(name)) {
    return ['warning', `Capitalized group names are not allowed.`];
  }
}
