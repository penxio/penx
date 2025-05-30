import { format } from 'date-fns'
import Dexie, { Table } from 'dexie'
import { get } from 'idb-keyval'
import { ACTIVE_SITE } from '@penx/constants'
import {
  IAreaNode,
  IChat,
  ICreationNode,
  ICreationTagNode,
  IDocument,
  IJournalNode,
  IMessage,
  INode,
  ISiteNode,
  IStructNode,
  ISuggestion,
  ITagNode,
  NodeType,
} from '@penx/model-type'
import { IAsset } from '@penx/model-type/IAsset'
import { IChange, OperationType } from '@penx/model-type/IChange'
import { IFile } from '@penx/model-type/IFile'
import { uniqueId } from '@penx/unique-id'

class LocalDB extends Dexie {
  file!: Table<IFile, string>
  asset!: Table<IAsset, string>
  change!: Table<IChange, number>
  chat!: Table<IChat, string>
  message!: Table<IMessage, string>
  document!: Table<IDocument, string>
  suggestion!: Table<ISuggestion, string>

  constructor() {
    super('penx-local')
    this.version(19).stores({
      // Primary key and indexed props
      node: 'id, siteId, userId, areaId, type, date, [userId+type], [siteId+type], [areaId+type], [siteId+type+structType]',
      file: 'id, hash',
      asset: 'id, siteId, url, isPublic, isTrashed',
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

  private async addChange(
    id: string,
    op: OperationType,
    data = {} as Record<string, any>,
  ) {
    const site = (await get(ACTIVE_SITE)) as ISiteNode
    if (site?.props.isRemote) {
      const change = {
        operation: op,
        siteId: site.id,
        synced: 0,
        createdAt: new Date(),
        key: id,
        data,
      } as IChange
      await this.change.add(change)
    }
  }
}

export const localDB = new LocalDB()
