import {
  IAreaNode,
  ICreationNode,
  ICreationTagNode,
  IJournalNode,
  INode,
  ISettingsNode,
  ISpaceNode,
  IStructNode,
  ITagNode,
  NodeType,
} from '@penx/model-type'

export interface AddRowOptions {
  databaseId: string

  type?: 'common' | 'todo' | 'file'

  ref?: string // first column id

  sourceId?: string // todo source id

  fileHash?: string // file hash

  googleDriveFileId?: string // google drive file id
}

export interface AddRowByFieldNameOptions {
  databaseId: string
  [key: string]: any
}

export interface CreateFileRowOptions {
  userId: string

  ref: string // first column id

  fileHash: string // file hash

  googleDriveFileId: string // google drive file id
}

export interface NodeModelApi {
  get: <T extends INode>(id: string) => Promise<T>

  getNodesByType: <T extends INode>(type: string) => Promise<T>

  findMany<T = INode>(where: Partial<INode>): Promise<T[]>

  insert: <T extends INode>(data: Partial<T>) => Promise<T>

  insertMany: <T = INode>(data: Partial<T>[]) => Promise<any>

  update: <T extends INode>(id: string, input: Partial<T>) => any

  delete(id: string): any

  deleteMany: (where: Partial<INode>) => Promise<any>

  deleteNodeByIds: (nodeIds: string[]) => Promise<any>
}
