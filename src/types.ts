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

type ValidatorError = [ErrorType, string];

interface Validators<T> {
  [ruleName: string]: (data: T) => ValidatorError | void;
}

export interface ValidatorGroups {
  pages: Validators<Page>;
  layers: Validators<Layer>;
}

export interface LintingError {
  ruleID: string;
  message: string;
  type: ErrorType;
  path: string;
}
