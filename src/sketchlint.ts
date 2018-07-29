import * as sketch2json from 'sketch2json';
import validateGroup from './utilities/validateGroup';
import validateLayers from './utilities/validateLayers';
import {LintingError, Page, ValidatorGroups} from './types';

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
    for (const ruleID of Object.keys(validatorGroups.meta)) {
      const validator = validatorGroups.meta[ruleID];
      const error = validator(sketchJSON.meta);
      if (error) {
        lintingErrors.push({
          ruleID,
          message: error[1],
          type: error[0],
          path: 'meta',
          category: 'meta',
        });
      }
    }
  }

  for (const page of pages) {
    const {layers, name} = page;
    const layersErrors = validateLayers(
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
    lintingErrors = [...lintingErrors, ...layersErrors];
  }

  return lintingErrors;
}

export default sketchlint;
