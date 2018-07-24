import validateGroup from './validateGroup';
import {Layer, ValidatorGroups, LintingError, Validators} from '../types';

interface Options {
  pathPrefix: string;
}

function validateLayers(
  className: string,
  layers: Layer[],
  classValidators: any,
  {pathPrefix}: Options,
): LintingError[] {
  return validateGroup<Layer, ValidatorGroups['layers']>(layers, {
    getPath: ({name}: Layer) => `${pathPrefix}/${name}`,
    getValidators: ({_class}: Layer) =>
      classValidators[_class] || classValidators['*'],
    eachItem(layer: Layer) {
      if (!layer.layers) {
        return [];
      }
      return validateLayers(layer._class, layer.layers, classValidators, {
        pathPrefix: `${pathPrefix}/${layer.name}`,
      });
    },
  });
}

export default validateLayers;
