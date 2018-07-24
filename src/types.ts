export interface Layer {
  name: string;
  layers: Layer[];
  [key: string]: any;
}

export interface Page {
  name: string;
  layers: Layer[];
  [key: string]: any;
}

export type ErrorType = 'error' | 'warning';
export type ValidatorError = [ErrorType, string];

export interface Validators<T> {
  [ruleName: string]: (data: T) => ValidatorError | void;
}

export interface ValidatorGroups {
  pages?: Validators<Page>;
  layers?: Validators<Layer>;
  artboards?: Validators<any>;
}

export interface LintingError {
  ruleID: string;
  message: string;
  type: ErrorType;
  path: string;
}
