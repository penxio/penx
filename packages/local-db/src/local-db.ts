import Dexie, { Table } from 'dexie'
import { IChat, IDocument, IMessage, ISuggestion } from '@penx/model-type'
import { IArea } from '@penx/model-type/IArea'
import { IAsset } from '@penx/model-type/IAsset'
import { ICreation } from '@penx/model-type/ICreation'
import { ICreationTag } from '@penx/model-type/ICreationTag'
import { IDatabase } from '@penx/model-type/IDatabase'
import { IFile } from '@penx/model-type/IFile'
import { IMold } from '@penx/model-type/IMold'
import { ISite } from '@penx/model-type/ISite'
import { ITag } from '@penx/model-type/ITag'
import { uniqueId } from '@penx/unique-id'

class LocalDB extends Dexie {
  file!: Table<IFile, string>
  asset!: Table<IAsset, string>
  database!: Table<IDatabase, string>
  creation!: Table<ICreation, string>
  site!: Table<ISite, string>
  area!: Table<IArea, string>
  mold!: Table<IMold, string>
  tag!: Table<ITag, string>
  creationTag!: Table<ICreationTag, string>
  chat!: Table<IChat, string>
  message!: Table<IMessage, string>
  suggestion!: Table<ISuggestion, string>
  document!: Table<IDocument, string>

  constructor() {
    super('penx-local')
    this.version(11).stores({
      // Primary key and indexed props
      file: 'id, hash',
      asset: 'id, siteId, url, isPublic, isTrashed',
      database: 'id, siteId, userId, parentId',
      site: 'id, userId',
      area: 'id, userId, siteId',
      mold: 'id, userId, siteId',
      tag: 'id, siteId, userId, [siteId+name]',
      creation:
        'id, siteId, userId, areaId, moldId, type, status, [siteId+areaId]',
      creationTag: 'id, creationId, siteId, tagId',
      chat: 'id, siteId',
      message: 'id, siteId',
      document: 'id, siteId',
      suggestion: 'id, siteId',
    })
  }

  async addFile(hash: string, file: File) {
    try {
      return this.file.add({
        id: uniqueId(),
        hash,
        file,
      })
    } catch (error) {}
  }
}

export const localDB = new LocalDB()
