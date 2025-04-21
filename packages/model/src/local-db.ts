import Dexie, { Table } from 'dexie'
import { IAsset } from './IAsset'
import { IBlock } from './IBlock'
import { IDatabase } from './IDatabase'
import { IFile } from './IFile'
import { IPage } from './IPage'
import { uniqueId } from '../unique-id'

class LocalDB extends Dexie {
  file!: Table<IFile, string>
  asset!: Table<IAsset, string>
  block!: Table<IBlock, string>
  page!: Table<IPage, string>
  database!: Table<IDatabase, string>

  constructor() {
    super('penx-local')
    this.version(6).stores({
      // Primary key and indexed props
      file: 'id, hash',
      asset: 'id, siteId, url, isPublic, isTrashed',
      page: 'id, siteId, userId, parentId, isJournal',
      database: 'id, siteId, userId, parentId',
      block: 'id, siteId, userId, parentId, pageId, type',
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
