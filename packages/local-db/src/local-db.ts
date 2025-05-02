import Dexie, { Table } from 'dexie'
import { IChat, IDocument, IMessage, ISuggestion } from '@penx/model-type'
import { IArea } from '@penx/model-type/IArea'
import { IAsset } from '@penx/model-type/IAsset'
import { IChange } from '@penx/model-type/IChange'
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
  change!: Table<IChange, string>

  constructor() {
    super('penx-local')
    this.version(13).stores({
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
      change: 'id, table, siteId',
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

  getCreation = <T = ICreation>(id: string) => {
    return this.creation.get(id) as any as Promise<T>
  }

  addCreation = async <T extends ICreation>(data: Partial<T>) => {
    const id = await this.creation.add({
      id: uniqueId(),
      ...data,
    } as ICreation)

    const creation = (await this.creation.get(id))!

    await this.change.add({
      id: uniqueId(),
      operation: 'CREATE',
      table: 'creation',
      siteId: creation.siteId,
      key: creation.id,
      data: creation,
      synced: false,
      createdAt: new Date(),
    })
    return creation
  }

  putCreation = async <T extends ICreation>(data: Partial<T>) => {
    const id = await this.creation.put({
      id: uniqueId(),
      ...data,
    } as ICreation)

    const creation = (await this.creation.get(id))!

    await this.change.add({
      id: uniqueId(),
      operation: 'CREATE',
      table: 'creation',
      siteId: creation.siteId,
      key: creation.id,
      data: creation,
      synced: false,
      createdAt: new Date(),
    })
    return creation
  }

  updateCreation = async <T extends ICreation>(
    id: string,
    data: Partial<T>,
  ) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.creation.update(id, newData)
    // return this.creation.get(id) as any as Promise<T>

    const creation = (await this.creation.get(id))!

    await this.change.add({
      id: uniqueId(),
      operation: 'UPDATE',
      table: 'creation',
      siteId: creation.siteId,
      key: creation.id,
      data: newData,
      synced: false,
      createdAt: new Date(),
    })
    return creation
  }

  deleteCreation = async (id: string) => {
    const creation = (await this.creation.get(id))!
    await this.change.add({
      id: uniqueId(),
      operation: 'DELETE',
      table: 'creation',
      siteId: creation.siteId,
      key: creation.id,
      data: { id: creation.id },
      synced: false,
      createdAt: new Date(),
    })
    return this.creation.delete(id)
  }
}

export const localDB = new LocalDB()
