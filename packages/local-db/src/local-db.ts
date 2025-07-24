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

class LocalDB extends Dexie {
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
    this.version(20).stores({
      // Primary key and indexed props
      node: 'id, spaceId, userId, areaId, type, date, [userId+type], [spaceId+type], [areaId+type], [spaceId+type+structType]',
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

  getNode = <T extends INode>(id: string) => {
    return this.node.get(id) as any as Promise<T>
  }

  listSpaceNodes = (spaceId: string) => {
    return this.node.where({ spaceId }).toArray() as unknown as Promise<INode[]>
  }

  listAreaNodes = (areaId: string) => {
    return this.node.where({ areaId }).toArray() as unknown as Promise<INode[]>
  }

  addNode = async <T extends INode>(data: Partial<T>): Promise<T> => {
    const newNodeId = await this.node.add({
      id: uniqueId(),
      ...data,
    } as T)
    const node = (await this.node.get(newNodeId)) as any as T
    await this.addChange(node.id, OperationType.CREATE, node)
    return node
  }
  deleteNodeByIds = (nodeIds: string[]) => {
    return this.node.where('id').anyOf(nodeIds).delete()
  }

  updateNodeProps = async <T extends any>(id: string, input: Partial<T>) => {
    const node = await this.getNode(id)
    const updatedAt = new Date()
    await this.node.update(id, {
      updatedAt,
      props: {
        ...node.props,
        ...input,
      },
    })

    await this.addChange(id, OperationType.UPDATE, {
      updatedAt,
      ...input,
    })
  }

  getSpace = (id: string) => {
    return this.node.get(id) as any as Promise<ISpaceNode>
  }

  getSpaceByUserId = (userId: string) => {
    return this.node
      .where({ type: NodeType.SPACE, userId })
      .first() as unknown as Promise<ISpaceNode>
  }

  listAllSpaces = () => {
    return this.node
      .where({ type: NodeType.SPACE })
      .toArray() as unknown as Promise<ISpaceNode[]>
  }

  listAllSpaceByUserId = (userId: string) => {
    return this.node
      .where({
        type: NodeType.SPACE,
        userId,
      })
      .toArray() as unknown as Promise<ISpaceNode[]>
  }

  addSpace = async <T extends ISpaceNode>(data: Partial<T>) => {
    const space = await this.addNode({
      id: uniqueId(),
      type: NodeType.SPACE,
      ...data,
    } as ISpaceNode)

    return space as T
  }

  updateSpaceProps = async (
    id: string,
    props: Partial<ISpaceNode['props']>,
  ) => {
    await this.updateNodeProps(id, props)
  }

  listAreas = (spaceId?: string) => {
    const condition = spaceId
      ? { type: NodeType.AREA, spaceId }
      : { type: NodeType.SPACE }

    return this.node.where(condition).toArray() as unknown as Promise<
      IAreaNode[]
    >
  }

  addAreaNode = async <T extends IAreaNode>(node: Partial<T>): Promise<T> => {
    const newNodeId = await this.addNode({
      type: NodeType.AREA,
      ...node,
    } as T)
    return this.node.get(newNodeId) as any as Promise<T>
  }

  listStructs = (areaId: string) => {
    return this.node
      .where({ type: NodeType.STRUCT, areaId })
      .toArray() as unknown as Promise<IStructNode[]>
  }

  getTag = (id: string) => {
    return this.getNode<ITagNode>(id)
  }

  listTags = (areaId: string) => {
    return this.node
      .where({ type: NodeType.TAG, areaId })
      .toArray() as unknown as Promise<ITagNode[]>
  }

  listCreationTags = (areaId: string) => {
    return this.node
      .where({ type: NodeType.CREATION_TAG, areaId })
      .toArray() as unknown as Promise<ICreationTagNode[]>
  }

  listCreationTagsByArea = (areaId: string) => {
    return this.node
      .where({ type: NodeType.CREATION_TAG, areaId })
      .toArray() as unknown as Promise<ICreationTagNode[]>
  }

  getCreationTag = (id: string) => {
    return this.getNode<ICreationTagNode>(id)
  }

  getCreation = (id: string) => {
    return this.getNode<ICreationNode>(id)
  }

  listCreations = (areaId: string) => {
    return this.node
      .where({ type: NodeType.CREATION, areaId })
      .toArray() as unknown as Promise<ICreationNode[]>
  }

  listCreationsByArea = (areaId: string) => {
    return this.node
      .where({ type: NodeType.CREATION, areaId })
      .toArray() as unknown as Promise<ICreationNode[]>
  }

  addCreation = async <T extends ICreationNode>(
    node: Partial<T>,
  ): Promise<T> => {
    const newNodeId = await this.addNode({
      type: NodeType.CREATION,
      ...node,
    } as T)

    return this.node.get(newNodeId) as any as Promise<T>
  }

  updateCreationProps = async (
    id: string,
    props: Partial<ICreationNode['props']>,
  ) => {
    return this.updateNodeProps(id, props)
  }

  deleteCreation = async (id: string) => {
    await this.addChange(id, OperationType.DELETE)
    return this.node.delete(id)
  }

  addArea = async (data: Partial<IAreaNode>) => {
    const area = await this.addNode({
      id: uniqueId(),
      ...data,
    } as IAreaNode)

    return area as IAreaNode
  }

  updateAreaProps = async (id: string, props: Partial<IAreaNode['props']>) => {
    return await this.updateNodeProps(id, props)
  }

  addStruct = async (data: Partial<IStructNode>) => {
    const struct = await this.addNode({
      id: uniqueId(),
      ...data,
    } as IStructNode)
  }

  updateStructProps = async (
    id: string,
    props: Partial<IStructNode['props']>,
  ) => {
    await this.updateNodeProps(id, props)
  }

  // TODO: need  improve
  deleteStruct = async (id: string) => {
    const struct = await this.getNode<IStructNode>(id)
    console.log('====struct:', struct)

    const nodes = (await this.node
      .where({
        // areaId: struct.areaId,
        type: NodeType.CREATION,
      })
      .toArray()) as ICreationNode[]

    const ids = nodes
      .filter((node) => node.props.structId === id)
      .map((n) => n.id)

    await this.deleteNodeByIds(ids)
    await this.node.delete(id)
    await this.addChange(id, OperationType.DELETE)
  }

  listJournals = (areaId?: string) => {
    const condition = areaId
      ? { type: NodeType.JOURNAL, areaId }
      : { type: NodeType.JOURNAL }

    return this.node.where(condition).toArray() as unknown as Promise<
      IJournalNode[]
    >
  }

  addJournal = async (data: Partial<IJournalNode>) => {
    const journal = await this.addNode({
      id: uniqueId(),
      ...data,
    } as IJournalNode)

    return journal
  }

  updateJournalProps = async (
    id: string,
    props: Partial<IJournalNode['props']>,
  ) => {
    await this.updateNodeProps(id, props)
  }

  addTag = async (data: Partial<ITagNode>) => {
    const tag = await this.addNode({
      id: uniqueId(),
      ...data,
    } as ITagNode)
  }

  updateTagProps = async (id: string, props: Partial<ITagNode['props']>) => {
    return this.updateNodeProps(id, props)
  }

  deleteTag = async (id: string) => {
    await this.addChange(id, OperationType.DELETE)
    return this.node.delete(id)
  }

  addCreationTag = async (data: Partial<ICreationTagNode>) => {
    const creationTag = await this.addNode({
      id: uniqueId(),
      ...data,
    } as ICreationTagNode)

    const creationTags = (await this.node
      .where({ type: NodeType.CREATION_TAG })
      .toArray()) as ICreationTagNode[]

    const count = creationTags.filter(
      (i) => i.props.tagId === creationTag.props.tagId,
    ).length

    await this.updateTagProps(creationTag.props.tagId, {
      creationCount: count,
    })
  }

  updateCreationTagProps = async (
    id: string,
    props: Partial<ICreationTagNode['props']>,
  ) => {
    await this.updateNodeProps(id, props)
  }

  deleteCreationTag = async (id: string) => {
    const creationTag = (await this.node.get(id))!
    const tagId = creationTag.props.tagId
    await this.addChange(id, OperationType.DELETE)
    await this.node.delete(id)

    const creationTags = (await this.node
      .where({ type: NodeType.CREATION_TAG })
      .toArray()) as ICreationTagNode[]

    const count = creationTags.filter((i) => i.props.tagId === tagId).length
    await this.updateTagProps(creationTag.props.tagId, {
      creationCount: count,
    })
  }

  getSettings = (spaceId: string) => {
    return this.node
      .where({ type: NodeType.SETTINGS, spaceId })
      .first() as unknown as Promise<ISettingsNode>
  }

  updateSettingsProps = async (
    id: string,
    props: Partial<ISettingsNode['props']>,
  ) => {
    await this.updateNodeProps(id, props)
  }

  upsertShortcutConfig = async (
    id: string,
    props: Partial<ISettingsNode['props']>,
  ) => {
    await this.updateNodeProps(id, props)
  }

  private async addChange(
    id: string,
    op: OperationType,
    data = {} as Record<string, any>,
  ) {
    const space = (await get(ACTIVE_SPACE)) as ISpaceNode
    if (space?.props.isRemote) {
      const change = {
        operation: op,
        spaceId: space.id,
        synced: 0,
        createdAt: new Date(),
        key: id,
        data,
      } as IChange
      await this.change.add(change)
    }
  }

  deleteAllSpaceData = (spaceId: string) => {
    return this.node.where('spaceId').anyOf(spaceId).delete()
  }
}

export const localDB = new LocalDB()
