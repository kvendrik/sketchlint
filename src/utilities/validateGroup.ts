import {ErrorType, LintingError, Validators, Category} from '../types';

interface Options<I, V> {
  getValidators: (item: I) => Validators<V> | undefined;
  getCategory(className: string): Category;
  getPath(item: I): string;
  eachItem?(item: I): LintingError[];
}

function validateGroup<I, V>(
  items: I[],
  {getCategory, getValidators, getPath, eachItem}: Options<I, V>,
): LintingError[] {
  let errors: LintingError[] = [];

  for (const item of items) {
    const validators = getValidators(item);

    if (eachItem) {
      errors = [...errors, ...eachItem(item)];
    }

    if (!validators) {
      continue;
    }

    for (const ruleID of Object.keys(validators)) {
      const validator = (validators as any)[ruleID];
      const error = validator(item);

      if (error) {
        errors.push({
          ruleID,
          message: error[1],
          type: error[0] as ErrorType,
          path: getPath(item),
          category: getCategory((item as any)._class),
        });
      }
    }
  }

  return errors;
}

export default validateGroup;
