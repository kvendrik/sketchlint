import * as sketch2json from 'sketch2json';
import validateGroup from './utilities/validateGroup';
import {Layer, ValidatorGroups, LintingError, Page} from './types';

function validateLayers(
  layers: Layer[],
  validators: ValidatorGroups['layers'],
  pathPrefix: string,
): LintingError[] {
  return validateGroup<Layer, ValidatorGroups['layers']>(layers, validators, {
    getPath: ({name}: Layer) => `${pathPrefix}/${name}`,
    eachItem(layer: Layer) {
      if (layer.layers) {
        return validateLayers(
          layer.layers,
          validators,
          `${pathPrefix}/${layer.name}`,
        );
      }
      return [];
    },
  });
}

async function sketchlint(sketchData: any, validatorGroups: ValidatorGroups) {
  const sketchJSON = await sketch2json(sketchData);
  const pages: Page[] = Object.values(sketchJSON.pages);
  let lintingErrors: LintingError[] = [];

  if (validatorGroups.pages) {
    const pagesErrors = validateGroup<Page, ValidatorGroups['pages']>(
      pages,
      validatorGroups.pages,
      {
        getPath: ({name}: Page) => name,
      },
    );
    lintingErrors = [...lintingErrors, ...pagesErrors];
  }

  if (validatorGroups.layers) {
    for (const page of pages) {
      const {layers, name} = page;
      const layersErrors = validateLayers(layers, validatorGroups.layers, name);
      lintingErrors = [...lintingErrors, ...layersErrors];
    }
  }

  return lintingErrors;
}

export default sketchlint;
