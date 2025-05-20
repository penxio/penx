export enum ColumnType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  PASSWORD = 'PASSWORD',
  BOOLEAN = 'BOOLEAN',
  MARKDOWN = 'MARKDOWN',
  URL = 'URL',
  IMAGE = 'IMAGE',
  RATE = 'RATE',

  FILE = 'FILE',

  TODO_SOURCE = 'TODO_SOURCE',

  PRIMARY = 'PRIMARY',

  SINGLE_SELECT = 'SINGLE_SELECT',

  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  DATE = 'DATE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export enum ViewType {
  TABLE = 'TABLE',
  LIST = 'LIST',
  CALENDAR = 'CALENDAR',
  GALLERY = 'GALLERY',
  KANBAN = 'KANBAN',
}

export interface ViewColumn {
  columnId: string
  width: number
  visible: boolean
}

export interface Option {
  id: string
  name: string
  color: string
  isDefault: boolean
}

export interface Sort {
  columnId: string
  isAscending: boolean
}

export interface Group {
  columnId: string
  isAscending: boolean
  showEmptyGroup: boolean
}

export enum ConjunctionType {
  OR = 'OR',
  AND = 'AND',
}

export enum OperatorType {
  IS_EMPTY = 'IS_EMPTY',
  IS_NOT_EMPTY = 'IS_NOT_EMPTY',
  CONTAINS = 'CONTAINS',
  DOES_NOT_CONTAIN = 'DOES_NOT_CONTAIN',

  IS = 'IS',
  IS_NOT = 'IS_NOT',

  EQUAL = 'EQUAL', // =
  NOT_EQUAL = 'NOT_EQUAL', //!=
  LESS_THAN = 'LESS_THAN', // <
  MORE_THAN = 'MORE_THAN', // >

  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL', // <=
  MORE_THAN_OR_EQUAL = 'MORE_THAN_OR_EQUAL', // >=

  FILENAME = 'FILENAME',
  FILETYPE = 'FILETYPE',
}

export interface Filter {
  columnId: string // column id
  conjunction: ConjunctionType
  operator: OperatorType
  value: any
}
