import { get } from 'idb-keyval'
import { ACTIVE_SPACE } from '@penx/constants'
import { idb } from '@penx/indexeddb'
import {
  IAreaNode,
  ICreationNode,
  ICreationTagNode,
  IJournalNode,
  INode,
  ISettingsNode,
  ISpaceNode,
  IStructNode,
  ITagNode,
  NodeType,
} from '@penx/model-type'
import { IChange, OperationType } from '@penx/model-type/IChange'
import { uniqueId } from '@penx/unique-id'
import { NodeModelApi } from './types'

class LocalDB {
  node: NodeModelApi

  getNode = <T extends INode>(id: string): Promise<T> => {
    return this.node.get(id)
  }

  listSpaceNodes = (spaceId: string) => {
    return this.node.findMany({ spaceId })
  }

  listAreaNodes = (areaId: string) => {
    return this.node.findMany({ areaId })
  }

  addNode = async <T extends INode>(
    data: Partial<T>,
    changed = true,
  ): Promise<T> => {
    const node = await this.node.insert(data)

    if (changed) {
      await this.addChange(node.id, OperationType.CREATE, node)
    }
    return node
  }

  deleteNodeByIds = async (ids: string[]) => {
    await this.node.deleteNodeByIds(ids)
  }

  updateNodeProps = async <T extends INode>(
    id: string,
    input: Partial<T['props']>,
  ) => {
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
    return this.node.get<ISpaceNode>(id)
  }

  getSpaceByUserId = async (userId: string) => {
    const spaces = await this.node.findMany({
      type: NodeType.SPACE,
      userId,
    })

    return spaces[0] as ISpaceNode
  }

  listAllSpaces = () => {
    return this.node.findMany<ISpaceNode>({
      type: NodeType.SPACE,
    })
  }

  listAllSpaceByUserId = (userId: string) => {
    return this.node.findMany<ISpaceNode>({
      type: NodeType.SPACE,
      userId,
    })
  }

  addSpace = async <T extends ISpaceNode>(data: Partial<T>) => {
    return this.addNode(data)
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

    return this.node.findMany<IAreaNode>(condition)
  }

  addAreaNode = async <T extends IAreaNode>(node: Partial<T>): Promise<T> => {
    return this.addNode(node)
  }

  listStructs = (areaId: string) => {
    return this.node.findMany<IStructNode>({
      type: NodeType.STRUCT,
      areaId,
    })
  }

  getTag = (id: string) => {
    return this.getNode<ITagNode>(id)
  }

  listTags = (areaId: string) => {
    return this.node.findMany<ITagNode>({
      type: NodeType.TAG,
      areaId,
    })
  }

  listCreationTags = (areaId: string) => {
    return this.node.findMany<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
      areaId,
    })
  }

  listCreationTagsByArea = (areaId: string) => {
    return this.node.findMany<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
      areaId,
    })
  }

  getCreationTag = (id: string) => {
    return this.getNode<ICreationTagNode>(id)
  }

  getCreation = (id: string) => {
    return this.getNode<ICreationNode>(id)
  }

  listCreations = (areaId: string) => {
    return this.node.findMany<ICreationNode>({
      type: NodeType.CREATION,
      areaId,
    })
  }

  listCreationsByArea = (areaId: string) => {
    return this.node.findMany<ICreationNode>({
      type: NodeType.CREATION,
      areaId,
    })
  }

  addCreation = async <T extends ICreationNode>(
    node: Partial<T>,
  ): Promise<T> => {
    const newNode = await this.addNode<ICreationNode>({
      type: NodeType.CREATION,
      ...node,
    } as T)
    return newNode as T
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
    const nodes = await this.node.findMany<ICreationNode>({
      type: NodeType.CREATION,
    })

    const ids = nodes
      .filter((node) => node.props.structId === id)
      .map((n) => n.id)

    await this.deleteNodeByIds(ids)
    await this.node.delete(id)
    for (const id of ids) {
      await this.addChange(id, OperationType.DELETE)
    }
    await this.addChange(id, OperationType.DELETE)
  }

  listJournals = (areaId?: string) => {
    const condition = areaId
      ? { type: NodeType.JOURNAL, areaId }
      : { type: NodeType.JOURNAL }

    return this.node.findMany<IJournalNode>(condition)
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

    const creationTags = await this.node.findMany<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
    })

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
    const creationTag = await this.getNode<ICreationTagNode>(id)
    const tagId = creationTag.props.tagId
    await this.addChange(id, OperationType.DELETE)
    await this.node.delete(id)

    const creationTags = await this.node.findMany<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
    })

    const count = creationTags.filter((i) => i.props.tagId === tagId).length
    await this.updateTagProps(creationTag.props.tagId, {
      creationCount: count,
    })
  }

  getSettings = async (spaceId: string) => {
    const lists = await this.node.findMany<ISettingsNode>({
      type: NodeType.SETTINGS,
      spaceId,
    })
    return lists[0] as ISettingsNode
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
      await idb.change.add(change)
    }
  }

  deleteAllSpaceData = (spaceId: string) => {
    return this.node.deleteMany({ spaceId })
  }
}

export const localDB = new LocalDB()
