import Dexie, { Table } from 'dexie'
import { IArea } from '@penx/model/IArea'
import { IAsset } from '@penx/model/IAsset'
import { ICreation } from '@penx/model/ICreation'
import { ICreationTag } from '@penx/model/ICreationTag'
import { IDatabase } from '@penx/model/IDatabase'
import { IFile } from '@penx/model/IFile'
import { IMold } from '@penx/model/IMold'
import { ISite } from '@penx/model/ISite'
import { ITag } from '@penx/model/ITag'
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

  constructor() {
    super('penx-local')
    this.version(10).stores({
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
