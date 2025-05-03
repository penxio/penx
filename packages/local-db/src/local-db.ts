import Dexie, { Table } from 'dexie'
import { get, set } from 'idb-keyval'
import { ACTIVE_SITE } from '@penx/constants'
import { IChat, IDocument, IMessage, ISuggestion } from '@penx/model-type'
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

  getCreation = (id: string) => {
    return this.creation.get(id) as any as Promise<ICreation>
  }

  addCreation = async (data: Partial<ICreation>) => {
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

  putCreation = async (data: Partial<ICreation>) => {
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

  updateCreation = async (id: string, data: Partial<ICreation>) => {
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
    await this.addChange({
      operation: OperationType.DELETE,
      table: 'creation',
      data: { id },
    })
    return this.creation.delete(id)
  }

  updateArea = async (id: string, data: Partial<IArea>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.area.update(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      table: 'area',
      data: {
        id,
        ...newData,
      },
    })
  }

  addMold = async (data: Partial<IMold>) => {
    const id = await this.mold.add({
      id: uniqueId(),
      ...data,
    } as IMold)

    const mold = (await this.mold.get(id))!

    await this.addChange({
      operation: OperationType.CREATE,
      table: 'mold',
      data: mold,
    })
  }

  updateMold = async (id: string, data: Partial<IMold>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.mold.update(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      table: 'mold',
      data: {
        id,
        ...newData,
      },
    })
  }

  deleteMold = async (id: string) => {
    await this.addChange({
      operation: OperationType.DELETE,
      table: 'mold',
      data: { id },
    })
    return this.mold.delete(id)
  }

  addTag = async (data: Partial<ITag>) => {
    const id = await this.tag.add({
      id: uniqueId(),
      ...data,
    } as ITag)

    const tag = (await this.tag.get(id))!

    await this.addChange({
      operation: OperationType.CREATE,
      table: 'tag',
      data: tag,
    })
  }

  updateTag = async (id: string, data: Partial<ITag>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.tag.update(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      table: 'tag',
      data: {
        id,
        ...newData,
      },
    })
  }

  deleteTag = async (id: string) => {
    await this.addChange({
      operation: OperationType.DELETE,
      table: 'tag',
      data: { id },
    })
    return this.tag.delete(id)
  }

  addCreationTag = async (data: Partial<ICreationTag>) => {
    const id = await this.creationTag.add({
      id: uniqueId(),
      ...data,
    } as ICreationTag)

    const creationTag = (await this.creationTag.get(id))!

    await this.addChange({
      operation: OperationType.CREATE,
      table: 'creationTag',
      data: creationTag,
    })

    const count = await this.creationTag
      .where({ tagId: creationTag.tagId })
      .count()

    await this.updateTag(creationTag.tagId, { creationCount: count })
  }

  updateCreationTag = async (id: string, data: Partial<ICreationTag>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.creationTag.update(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      table: 'creationTag',
      data: {
        id,
        ...newData,
      },
    })
  }

  deleteCreationTag = async (id: string) => {
    const creationTag = (await this.creationTag.get(id))!
    const tagId = creationTag.tagId
    await this.addChange({
      operation: OperationType.DELETE,
      table: 'creationTag',
      data: { id },
    })

    this.creationTag.delete(id)

    const count = await this.creationTag.where({ tagId }).count()

    await this.updateTag(tagId, { creationCount: count })
  }

  private async addChange(
    data: Omit<IChange, 'id' | 'key' | 'synced' | 'createdAt' | 'siteId'>,
  ) {
    const site = (await get(ACTIVE_SITE)) as ISite
    if (site.isRemote) {
      await this.change.add({
        siteId: site.id,
        synced: 0,
        createdAt: new Date(),
        key: data.data.id,
        ...data,
      } as IChange)
    }
  }
}

export const localDB = new LocalDB()
