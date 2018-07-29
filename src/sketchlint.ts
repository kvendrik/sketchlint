import * as sketch2json from 'sketch2json';
import validateGroup, {validateItem} from './utilities/validateGroup';
import validateLayers from './utilities/validateLayers';
import {LintingError, Page, Validators, Meta, Layer} from './types';

interface ValidatorGroups {
  pages?: Validators<Page>;
  meta?: Validators<Meta>;
  layers?: Validators<Layer>;
  artboards?: Validators<Layer>;
  groups?: Validators<Layer>;
}

function lintLayersForPages(pages: Page[], validatorGroups: ValidatorGroups) {
  function lintLayerForPage({layers, name}: Page) {
    return validateLayers(
      layers,
      {
        default: validatorGroups.layers || {},
        artboard: validatorGroups.artboards || {},
        group: validatorGroups.groups || {},
      },
      {
        getCategory(className: string) {
          if (className === 'artboard') {
            return 'artboards';
          } else if (className === 'group') {
            return 'groups';
          }
          return 'layers';
        },
        pathPrefix: name,
      },
    );
  }

  let lintingErrors: LintingError[] = [];
  for (const page of pages) {
    lintingErrors = [...lintingErrors, ...lintLayerForPage(page)];
  }
  return lintingErrors;
}

async function sketchlint(sketchData: any, validatorGroups: ValidatorGroups) {
  const sketchJSON = await sketch2json(sketchData);
  const pages: Page[] = Object.values(sketchJSON.pages);
  let lintingErrors: LintingError[] = [];

  if (validatorGroups.pages) {
    const pagesErrors = validateGroup<Page, ValidatorGroups['pages']>(pages, {
      getCategory: () => 'pages',
      getValidators: () => validatorGroups.pages,
      getPath: ({name}: Page) => name,
    });
    lintingErrors = [...lintingErrors, ...pagesErrors];
  }

  if (validatorGroups.meta) {
    const metaErrors = validateItem<Meta, ValidatorGroups['meta']>(
      sketchJSON.meta,
      validatorGroups.meta,
      {
        getPath: () => 'meta',
        getCategory: () => 'meta',
      },
    );
    lintingErrors = [...lintingErrors, ...metaErrors];
  }

  return [...lintingErrors, ...lintLayersForPages(pages, validatorGroups)];
}

export default sketchlint;
