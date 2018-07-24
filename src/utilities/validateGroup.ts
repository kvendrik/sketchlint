import {ErrorType, LintingError} from '../types';

interface Options<I> {
  getPath(item: I): string;
  eachItem?(item: I): LintingError[];
}

function validateGroup<I, V>(
  items: I[],
  validators: V,
  {getPath, eachItem}: Options<I>,
): LintingError[] {
  let errors: LintingError[] = [];

  for (const item of items) {
    for (const ruleID of Object.keys(validators)) {
      const validator = (validators as any)[ruleID];
      const error = validator(item);
      const path = getPath(item);

      if (eachItem) {
        errors = [...errors, ...eachItem(item)];
      }

      if (error) {
        errors.push({
          ruleID,
          message: error[1],
          type: error[0] as ErrorType,
          path,
        });
      }
    }
  }

  return errors;
}

export default validateGroup;
