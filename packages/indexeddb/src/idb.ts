import { format } from 'date-fns'
import Dexie, { Table } from 'dexie'
import { get } from 'idb-keyval'
import { ACTIVE_SPACE } from '@penx/constants'
import {
  IAreaNode,
  IChat,
  ICreationNode,
  ICreationTagNode,
  IDocument,
  IJournalNode,
  IMessage,
  INode,
  ISettingsNode,
  ISpaceNode,
  IStructNode,
  ISuggestion,
  ITagNode,
  IVoice,
  NodeType,
} from '@penx/model-type'
import { IAsset } from '@penx/model-type/IAsset'
import { IChange, OperationType } from '@penx/model-type/IChange'
import { IFile } from '@penx/model-type/IFile'
import { uniqueId } from '@penx/unique-id'

export class IDB extends Dexie {
  node!: Table<INode, string>
  file!: Table<IFile, string>
  voice!: Table<IVoice, string>
  asset!: Table<IAsset, string>
  change!: Table<IChange, number>
  chat!: Table<IChat, string>
  message!: Table<IMessage, string>
  document!: Table<IDocument, string>
  suggestion!: Table<ISuggestion, string>

  constructor() {
    super('penx-local')
    this.version(23).stores({
      // Primary key and indexed props
      node: 'id, spaceId, userId, areaId, type, date, [userId+type], [spaceId+type], [areaId+type]',
      file: 'id, hash',
      voice: 'id, hash',
      asset: 'id, spaceId, url, isPublic, isTrashed',
      chat: 'id, spaceId',
      message: 'id, spaceId',
      document: 'id, spaceId',
      suggestion: 'id, spaceId',
      change: '++id, table, spaceId, [spaceId+synced]',
    })
  }

  async addFile(hash: string, file: File) {
    return this.file.add({
      id: uniqueId(),
      hash,
      file,
    })
  }
}

export const idb = new IDB()
