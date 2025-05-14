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
  IMoldNode,
  INode,
  ISiteNode,
  ISuggestion,
  ITagNode,
  NodeType,
} from '@penx/model-type'
import { IAsset } from '@penx/model-type/IAsset'
import { IChange, OperationType } from '@penx/model-type/IChange'
import { IFile } from '@penx/model-type/IFile'
import { ISite } from '@penx/model-type/ISite'
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
      node: 'id, siteId, userId, areaId, type, date, [userId+type], [siteId+type], [areaId+type], [siteId+type+moldType]',
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
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as T)
    const node = (await this.node.get(newNodeId)) as any as Promise<T>

    await this.addChange({
      operation: OperationType.CREATE,
      data: node,
    })
    return node
  }

  updateNode = async <T extends INode>(id: string, data: Partial<T>) => {
    await this.node.update(id, {
      ...data,
    })

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...data,
      },
    })
  }

  updateNodeProps = async <T extends any>(id: string, data: Partial<T>) => {
    await this.node.update(id, {
      props: data,
    })

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        props: data,
      },
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

  updateSite = async (id: string, data: Partial<ISiteNode>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.updateNode(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...newData,
      },
    })
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

  listMolds = (siteId: string) => {
    return this.node
      .where({ type: NodeType.MOLD, siteId })
      .toArray() as unknown as Promise<IMoldNode[]>
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

  updateCreation = async (id: string, data: Partial<ICreationNode>) => {
    const newData: any = {
      updatedAt: new Date(),
      ...data,
    }

    await this.updateNode(id, newData)

    const creation = (await this.node.get(id))!

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...newData,
      },
    })
    return creation as ICreationNode
  }

  updateCreationProps = async (
    id: string,
    props: Partial<ICreationNode['props']>,
  ) => {
    const creation = await this.getCreation(id)
    const newData: any = {
      updatedAt: new Date(),
      props: {
        ...creation.props,
        ...props,
      },
    }
    return this.updateCreation(id, newData)
  }

  deleteCreation = async (id: string) => {
    await this.addChange({
      operation: OperationType.DELETE,
      data: { id },
    })
    return this.node.delete(id)
  }

  addArea = async (data: Partial<IAreaNode>) => {
    const area = await this.addNode({
      id: uniqueId(),
      ...data,
    } as IAreaNode)

    await this.addChange({
      operation: OperationType.CREATE,
      data: area,
    })
  }

  updateArea = async (id: string, data: Partial<IAreaNode>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.updateNode(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...newData,
      },
    })
  }

  updateAreaProps = async (id: string, props: Partial<IAreaNode['props']>) => {
    const area = (await this.node.get(id)) as IAreaNode
    const newData: any = {
      updatedAt: new Date(),
      props: {
        ...area.props,
        ...props,
      },
    }
    return this.updateArea(id, newData)
  }

  addMold = async (data: Partial<IMoldNode>) => {
    const mold = await this.addNode({
      id: uniqueId(),
      ...data,
    } as IMoldNode)

    await this.addChange({
      operation: OperationType.CREATE,
      data: mold,
    })
  }

  updateMold = async (id: string, data: Partial<IMoldNode>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.updateNode(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...newData,
      },
    })
  }

  deleteMold = async (id: string) => {
    await this.addChange({
      operation: OperationType.DELETE,
      data: { id },
    })
    return this.node.delete(id)
  }

  addTag = async (data: Partial<ITagNode>) => {
    const tag = await this.addNode({
      id: uniqueId(),
      ...data,
    } as ITagNode)

    await this.addChange({
      operation: OperationType.CREATE,
      data: tag,
    })
  }

  updateTag = async (id: string, data: Partial<ITagNode>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.node.update(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...newData,
      },
    })
  }

  updateTagProps = async (id: string, props: Partial<ITagNode['props']>) => {
    const node = (await this.node.get(id)) as ITagNode
    const newData: any = {
      updatedAt: new Date(),
      props: {
        ...node.props,
        ...props,
      },
    }
    return this.updateTag(id, newData)
  }

  deleteTag = async (id: string) => {
    await this.addChange({
      operation: OperationType.DELETE,
      data: { id },
    })
    return this.node.delete(id)
  }

  addCreationTag = async (data: Partial<ICreationTagNode>) => {
    const creationTag = await this.addNode({
      id: uniqueId(),
      ...data,
    } as ICreationTagNode)

    await this.addChange({
      operation: OperationType.CREATE,
      data: creationTag,
    })

    const creationTags = (await this.node
      .where({ type: NodeType.CREATION_TAG })
      .toArray()) as ICreationTagNode[]

    const count = creationTags.filter(
      (i) => i.props.tagId === creationTag.props.tagId,
    ).length

    const tag = (await this.node.get(creationTag.props.tagId))! as ITagNode
    await this.updateTag(creationTag.props.tagId, {
      props: {
        ...tag.props,
        creationCount: count,
      },
    })
  }

  updateCreationTag = async (id: string, data: Partial<ICreationTagNode>) => {
    const newData: any = data || {}
    if (!Reflect.has(data, 'updatedAt')) {
      newData.updatedAt = new Date()
    }

    await this.updateNode(id, newData)

    await this.addChange({
      operation: OperationType.UPDATE,
      data: {
        id,
        ...newData,
      },
    })
  }

  deleteCreationTag = async (id: string) => {
    const creationTag = (await this.node.get(id))!
    const tagId = creationTag.props.tagId

    await this.addChange({
      operation: OperationType.DELETE,
      data: { id },
    })

    this.node.delete(id)

    const creationTags = (await this.node
      .where({ type: NodeType.CREATION_TAG })
      .toArray()) as ICreationTagNode[]

    const count = creationTags.filter((i) => i.props.tagId === tagId).length

    const tag = (await this.node.get(creationTag.props.tagId))! as ITagNode
    await this.updateTag(creationTag.props.tagId, {
      props: {
        ...tag.props,
        creationCount: count,
      },
    })
  }

  private async addChange(
    data: Omit<IChange, 'id' | 'key' | 'synced' | 'createdAt' | 'siteId'>,
  ) {
    console.log('=====data:', data)

    const site = (await get(ACTIVE_SITE)) as ISiteNode
    if (site?.props.isRemote) {
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
