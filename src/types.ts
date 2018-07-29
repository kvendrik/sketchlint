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

export interface Meta {
  app: string;
  version: string;
  fonts: string[];
  [key: string]: any;
}

export type ErrorType = 'error' | 'warning';
export type ValidatorError = [ErrorType, string];

export interface Validators<T> {
  [ruleName: string]: (data: T) => ValidatorError | void;
}

export type ValidatorGroup =
  | 'pages'
  | 'layers'
  | 'artboards'
  | 'groups'
  | 'meta';

export interface ValidatorGroups {
  pages?: Validators<Page>;
  layers?: Validators<Layer>;
  artboards?: Validators<Layer>;
  groups?: Validators<Layer>;
  meta?: Validators<Meta>;
}

export interface LintingError {
  ruleID: string;
  message: string;
  type: ErrorType;
  path: string;
  category: ValidatorGroup;
}
