import Dexie, { Table } from 'dexie'
import { get } from 'idb-keyval'
import { ACTIVE_SITE } from '@penx/constants'
import {
  IAreaNode,
  IChat,
  ICreationNode,
  ICreationTagNode,
  IDocument,
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
  node!: Table<INode, string>
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

  getNode = <T extends INode>(id: string) => {
    return this.node.get(id) as any as Promise<T>
  }

  listNodes = (siteId: string) => {
    return this.node.where({ siteId }).toArray() as unknown as Promise<INode[]>
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

  getSite = (id: string) => {
    return this.node.get(id) as any as Promise<ISiteNode>
  }

  getSiteByUserId = (userId: string) => {
    return this.node
      .where({ type: NodeType.SITE, userId })
      .first() as unknown as Promise<ISiteNode>
  }

  listAllSites = () => {
    return this.node
      .where({ type: NodeType.SITE })
      .toArray() as unknown as Promise<ISiteNode[]>
  }

  listAllSiteByUserId = (userId: string) => {
    return this.node
      .where({
        type: NodeType.SITE,
        userId,
      })
      .toArray() as unknown as Promise<ISiteNode[]>
  }

  addSite = async <T extends ISiteNode>(data: Partial<T>) => {
    const site = await this.addNode({
      id: uniqueId(),
      type: NodeType.SITE,
      ...data,
    } as ISiteNode)

    return site as T
  }

  updateSiteProps = async (id: string, props: Partial<ISiteNode['props']>) => {
    await this.updateNodeProps(id, props)
  }

  listAreas = (siteId: string) => {
    return this.node
      .where({ type: NodeType.AREA, siteId })
      .toArray() as unknown as Promise<IAreaNode[]>
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

  listTags = (siteId: string) => {
    return this.node
      .where({ type: NodeType.TAG, siteId })
      .toArray() as unknown as Promise<ITagNode[]>
  }

  listCreationTags = (siteId: string) => {
    return this.node
      .where({ type: NodeType.CREATION_TAG, siteId })
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

  listCreations = (siteId: string) => {
    return this.node
      .where({ type: NodeType.CREATION, siteId })
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

    await this.addChange(area.id, OperationType.CREATE, area)
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

    await this.addChange(struct.id, OperationType.CREATE, struct)
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

  addTag = async (data: Partial<ITagNode>) => {
    const tag = await this.addNode({
      id: uniqueId(),
      ...data,
    } as ITagNode)

    await this.addChange(tag.id, OperationType.CREATE, tag)
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

    await this.addChange(creationTag.id, OperationType.CREATE, creationTag)

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
