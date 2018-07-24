import * as sketch2json from 'sketch2json';
import validateGroup from './utilities/validateGroup';
import validateLayers from './utilities/validateLayers';
import {ValidatorGroups, LintingError, Page} from './types';

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
      const layersErrors = validateLayers(
        'page',
        layers,
        {
          '*': validatorGroups.layers,
          artboard: validatorGroups.artboards || {},
        },
        {
          pathPrefix: name,
        },
      );
      lintingErrors = [...lintingErrors, ...layersErrors];
    }
  }

  return lintingErrors;
}

export default sketchlint;
