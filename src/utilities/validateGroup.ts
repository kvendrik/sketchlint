import {ErrorType, LintingError, Validators, Category} from '../types';

interface ValidateItemOptions<I> {
  getCategory(className: string): Category;
  getPath(item: I): string;
}

interface ValidateGroupOptions<I, V> extends ValidateItemOptions<I> {
  getValidators: (item: I) => Validators<V>;
  eachItem?(item: I): LintingError[];
}

export function validateItem<I, V>(
  item: I,
  validators: Validators<V>,
  {getPath, getCategory}: ValidateItemOptions<I>,
) {
  const errors: LintingError[] = [];
  for (const ruleID of Object.keys(validators)) {
    const validator = (validators as any)[ruleID];
    const category = getCategory((item as any)._class);
    const error = validator(item);

    if (error) {
      errors.push({
        ruleID,
        message: error[1],
        type: error[0] as ErrorType,
        path: getPath(item),
        category,
      });
    }
  }
  return errors;
}

export default function validateGroup<I, V>(
  items: I[],
  {getCategory, getValidators, getPath, eachItem}: ValidateGroupOptions<I, V>,
): LintingError[] {
  let errors: LintingError[] = [];

  for (const item of items) {
    const validators = getValidators(item);

    if (eachItem) {
      errors = [...errors, ...eachItem(item)];
    }

    errors = [
      ...errors,
      ...validateItem<I, V>(item, validators, {getPath, getCategory}),
    ];
  }

  return errors;
}
