import * as sketch2json from 'sketch2json';
import validateGroup, {validateItem} from './utilities/validateGroup';
import validateLayers from './utilities/validateLayers';
import {LintingError, Page, ValidatorGroups, Category} from './types';

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

export function lintFromJSON(
  sketchJSON: any,
  validatorGroups: ValidatorGroups,
) {
  const pages: Page[] = Object.values(sketchJSON.pages);
  let lintingErrors: LintingError[] = [];

  if (validatorGroups.pages) {
    const pagesErrors = validateGroup<Page, ValidatorGroups['pages']>(pages, {
      getCategory: () => 'pages',
      getValidators: () => validatorGroups.pages!,
      getPath: ({name}: Page) => name,
    });
    lintingErrors = [...lintingErrors, ...pagesErrors];
  }

  const singleItemCategories: Category[] = ['meta', 'document'];

  for (const category of singleItemCategories) {
    const data = sketchJSON[category];
    const validators = (validatorGroups as any)[category];

    if (validators) {
      const categoryErrors = validateItem(data, validators, {
        getPath: () => category,
        getCategory: () => category,
      });
      lintingErrors = [...lintingErrors, ...categoryErrors];
    }
  }

  return [...lintingErrors, ...lintLayersForPages(pages, validatorGroups)];
}

async function sketchlint(sketchData: any, validatorGroups: ValidatorGroups) {
  const sketchJSON = await sketch2json(sketchData);
  return lintFromJSON(sketchJSON, validatorGroups);
}

export default sketchlint;
