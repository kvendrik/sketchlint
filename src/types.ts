interface DynamicBase {
  [key: string]: any;
}

export type Layer = DynamicBase;
export type Meta = DynamicBase;
export type Document = DynamicBase;

export interface Page extends DynamicBase {
  name: string;
  layers: Layer[];
}

export type ErrorType = 'error' | 'warning';
export type ValidatorError = [ErrorType, string];

export interface Validators<T> {
  [ruleName: string]: (data: T) => ValidatorError | void;
}

export interface ValidatorGroups {
  pages?: Validators<Page>;
  meta?: Validators<Meta>;
  document?: Validators<Document>;
  layers?: Validators<Layer>;
  artboards?: Validators<Layer>;
  groups?: Validators<Layer>;
}

export type Category = keyof ValidatorGroups;

export interface LintingError {
  ruleID: string;
  message: string;
  type: ErrorType;
  path: string;
  category: Category;
}
