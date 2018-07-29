import validateGroup from './validateGroup';
import {Layer, LintingError, Validators, Category} from '../types';

interface Options {
  pathPrefix: string;
  getCategory(className: string): Category;
}

type ClassValidators = Validators<any>;

interface ClassValidatorsGroups {
  [className: string]: ClassValidators;
}

function validateLayers(
  layers: Layer[],
  classValidators: ClassValidatorsGroups,
  {getCategory, pathPrefix}: Options,
): LintingError[] {
  return validateGroup<Layer, ClassValidators>(layers, {
    getCategory,
    getPath: ({name}: Layer) => `${pathPrefix}/${name}`,
    getValidators: ({_class}: Layer) =>
      classValidators[_class] || classValidators.default,
    eachItem({layers: childLayers, name}: Layer) {
      if (!childLayers) {
        return [];
      }
      return validateLayers(childLayers, classValidators, {
        pathPrefix: `${pathPrefix}/${name}`,
        getCategory,
      });
    },
  });
}

export default validateLayers;
