import validateGroup from './validateGroup';
import {Layer, LintingError, Validators} from '../types';

interface Options {
  pathPrefix: string;
}

type ClassValidators = Validators<any>;

interface ClassValidatorsGroups {
  [className: string]: ClassValidators;
}

function validateLayers(
  layers: Layer[],
  classValidators: ClassValidatorsGroups,
  {pathPrefix}: Options,
): LintingError[] {
  return validateGroup<Layer, ClassValidators>(layers, {
    getPath: ({name}: Layer) => `${pathPrefix}/${name}`,
    getValidators: ({_class}: Layer) =>
      classValidators[_class] || classValidators.default,
    eachItem(layer: Layer) {
      if (!layer.layers) {
        return [];
      }
      return validateLayers(layer.layers, classValidators, {
        pathPrefix: `${pathPrefix}/${layer.name}`,
      });
    },
  });
}

export default validateLayers;
