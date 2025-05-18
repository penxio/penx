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
