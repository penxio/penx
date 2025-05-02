import Dexie, { Table } from 'dexie'
import { get, set } from 'idb-keyval'
import {
  IChat,
  IDocument,
  IMessage,
  ISuggestion,
  OperatorType,
} from '@penx/model-type'
import { IArea } from '@penx/model-type/IArea'
import { IAsset } from '@penx/model-type/IAsset'
import { IChange, OperationType } from '@penx/model-type/IChange'
import { ICreation } from '@penx/model-type/ICreation'
import { ICreationTag } from '@penx/model-type/ICreationTag'
import { IDatabase } from '@penx/model-type/IDatabase'
import { IFile } from '@penx/model-type/IFile'
import { IMold } from '@penx/model-type/IMold'
import { ISite } from '@penx/model-type/ISite'
import { ITag } from '@penx/model-type/ITag'
import { queryClient } from '@penx/query-client'
import { SessionData } from '@penx/types'
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
  change!: Table<IChange, number>
  chat!: Table<IChat, string>
  message!: Table<IMessage, string>
  document!: Table<IDocument, string>
  suggestion!: Table<ISuggestion, string>

  constructor() {
    super('penx-local')
    this.version(17).stores({
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
      change: '++id, table, siteId, [siteId+synced]',
    })
  }

  async addFile(hash: string, file: File) {
    return this.file.add({
      id: uniqueId(),
      hash,
      file,
    })
  }

  addSite = async (data: Partial<ISite>) => {
    const id = await this.site.add({
      id: uniqueId(),
      ...data,
    } as ISite)

    const site = await this.site.get(id)
    return site!
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

    await this.addChange({
      operation: OperationType.CREATE,
      table: 'creation',
      data: creation,
    })

    return creation
  }

  putCreation = async <T extends ICreation>(data: Partial<T>) => {
    const id = await this.creation.put({
      id: uniqueId(),
      ...data,
    } as ICreation)

    const creation = (await this.creation.get(id))!

    await this.addChange({
      operation: OperationType.CREATE,
      table: 'creation',
      data: creation,
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

    await this.addChange({
      operation: OperationType.UPDATE,
      table: 'creation',
      data: {
        id,
        ...newData,
      },
    })
    return creation
  }

  deleteCreation = async (id: string) => {
    const creation = (await this.creation.get(id))!
    await this.addChange({
      operation: OperationType.DELETE,
      table: 'creation',
      data: { id: creation.id },
    })
    return this.creation.delete(id)
  }

  private async addChange(
    data: Omit<IChange, 'id' | 'key' | 'synced' | 'createdAt' | 'siteId'>,
  ) {
    const session = await this.getSession()
    if (session) {
      await this.change.add({
        // id: uniqueId(),
        siteId: session.siteId,
        synced: 0,
        createdAt: new Date(),
        key: data.data.id,
        ...data,
      } as IChange)
    }
  }

  private async getSession() {
    const session = queryClient.getQueryData(['SESSION']) as SessionData
    console.log('store sesion:', session)

    if (session) return session
    const localSession = await get('SESSION')
    return localSession as SessionData
  }
}

export const localDB = new LocalDB()
