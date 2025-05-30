import { get } from 'idb-keyval'
import { ACTIVE_SITE } from '@penx/constants'
import { localDB } from '@penx/local-db'
import {
  IAreaNode,
  IChange,
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
  OperationType,
} from '@penx/model-type'
import { store } from '@penx/store'
import { uniqueId } from '@penx/unique-id'
import { pgStore } from './pgStore'

class DB {
  get pg() {
    return pgStore.pg
  }

  listAllSites = async () => {
    const result = await this.pg.query(`SELECT * FROM node where type = $1`, [
      NodeType.SITE,
    ])

    return result.rows as ISiteNode[]
  }

  listAllSiteByUserId = async (userId: string) => {
    const result = await this.pg.query(
      `SELECT * FROM node where type = $1 AND "userId" = $2`,
      [NodeType.SITE, userId],
    )

    return result.rows as ISiteNode[]
  }

  listNodes = async (siteId: string) => {
    const result = await this.pg.query(
      'SELECT * FROM node where "siteId" = $1',
      [siteId],
    )

    return result.rows as INode[]
  }

  getNode = async <T extends INode>(id: string) => {
    try {
      const query = 'SELECT * FROM node WHERE id = $1'
      const result = await this.pg.query(query, [id])

      if (result.rows.length > 0) {
        return result.rows[0] as T
      } else {
        return null as any as T
      }
    } catch (error) {
      throw error
    }
  }

  findNode = async <T extends INode>(
    where: Partial<INode>,
  ): Promise<T | null> => {
    try {
      const nodes = await this.queryNode(where)

      if (nodes.length > 0) {
        return nodes[0] as T
      } else {
        return null
      }
    } catch (error) {
      throw error
    }
  }

  queryNode = async <T extends INode>(where: Partial<INode>): Promise<T[]> => {
    try {
      const conditions: string[] = []
      const values: any[] = []
      let paramIndex = 1

      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined) {
          conditions.push(`"${key}" = $${paramIndex}`)
          values.push(value)
          paramIndex++
        }
      }

      const whereClause = conditions.join(' AND ')
      const query = `SELECT * FROM node WHERE ${whereClause} LIMIT 1`
      const result = await this.pg.query(query, values)

      return result.rows as T[]
    } catch (error) {
      throw error
    }
  }

  addNode = async (node: INode) => {
    const result = await this.pg.query(
      'INSERT INTO node (id, type, props, "createdAt", "updatedAt", "userId", "siteId", "areaId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        node.id,
        node.type,
        JSON.stringify(node.props),
        node.createdAt,
        node.updatedAt,
        node.userId,
        node.siteId,
        node.areaId || '',
      ],
    )

    const newNode = await this.getNode(node.id!)
    return newNode
  }

  addJournal = async (data: Partial<IJournalNode>) => {
    const journal = await this.addNode({
      id: uniqueId(),
      ...data,
    } as IJournalNode)

    await this.addChange(journal.id, OperationType.CREATE, journal)
    return journal
  }

  getCreation = (id: string) => {
    return this.getNode<ICreationNode>(id)
  }

  addCreation = async (node: ICreationNode) => {
    const newNode = await this.addNode(node)
    console.log('=======newNode:l', newNode)

    return newNode as ICreationNode
  }

  updateNode = async (id: string, input: any) => {
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (input.type !== undefined) {
      fields.push(`type = $${paramIndex++}`)
      values.push(input.type)
    }

    if (input.props !== undefined) {
      fields.push(`props = $${paramIndex++}`)
      values.push(JSON.stringify(input.props))
    }

    if (input.areaId !== undefined) {
      fields.push(`"areaId" = $${paramIndex++}`)
      values.push(input.areaId)
    }

    if (input.userId !== undefined) {
      fields.push(`"userId" = $${paramIndex++}`)
      values.push(input.userId)
    }

    if (input.siteId !== undefined) {
      fields.push(`"siteId" = $${paramIndex++}`)
      values.push(input.siteId)
    }

    fields.push(`"updatedAt" = $${paramIndex++}`)
    values.push(new Date())

    values.push(id)

    if (fields.length === 1) {
      throw new Error('No field to update')
    }

    const sql = `
      UPDATE node 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex} 
    `

    try {
      const result = await this.pg.query(sql, values)
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  updateNodeProps = async <T extends any>(id: string, input: Partial<T>) => {
    const node = await this.getNode(id)
    const updatedAt = new Date()
    await this.updateNode(id, {
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

  updateCreationProps = async (
    id: string,
    props: Partial<ICreationNode['props']>,
  ) => {
    return this.updateNodeProps(id, props)
  }

  deleteNodeByIds = async (nodeIds: string[]): Promise<void> => {
    try {
      if (nodeIds.length === 0) return

      const placeholders = nodeIds.map((_, index) => `$${index + 1}`).join(', ')
      const query = `DELETE FROM node WHERE id IN (${placeholders})`

      await this.pg.query(query, nodeIds)
    } catch (error) {
      throw error
    }
  }

  getSite = (id: string) => {
    return this.getNode(id) as any as Promise<ISiteNode>
  }

  getSiteByUserId = (userId: string) => {
    return this.findNode<ISiteNode>({ type: NodeType.SITE, userId })
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
    return this.queryNode<IAreaNode>({ type: NodeType.AREA, siteId })
  }

  addAreaNode = async <T extends IAreaNode>(node: Partial<T>): Promise<T> => {
    const newNode = await this.addNode({
      type: NodeType.AREA,
      ...node,
    } as T)
    return newNode as T
  }

  listStructs = (areaId: string) => {
    return this.queryNode<IStructNode>({ type: NodeType.STRUCT, areaId })
  }

  getTag = (id: string) => {
    return this.getNode<ITagNode>(id)
  }

  listTags = (areaId: string) => {
    return this.queryNode<ITagNode>({ type: NodeType.TAG, areaId })
  }

  listCreationTags = (areaId: string) => {
    return this.queryNode<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
      areaId,
    })
  }

  listCreationTagsByArea = (areaId: string) => {
    return this.queryNode<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
      areaId,
    })
  }

  getCreationTag = (id: string) => {
    return this.getNode<ICreationTagNode>(id)
  }

  listCreations = (areaId: string) => {
    return this.queryNode<ICreationNode>({ type: NodeType.CREATION, areaId })
  }

  listCreationsByArea = (areaId: string) => {
    return this.queryNode<ICreationNode>({ type: NodeType.CREATION, areaId })
  }

  deleteNode = async (id: string) => {
    try {
      const query = 'DELETE FROM node WHERE id = $1'
      await this.pg.query(query, [id])
    } catch (error) {
      throw error
    }
  }

  deleteCreation = async (id: string) => {
    await this.addChange(id, OperationType.DELETE)
    return this.deleteNode(id)
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

    const nodes = await this.queryNode<ICreationNode>({
      type: NodeType.CREATION,
    })

    const ids = nodes
      .filter((node) => node.props.structId === id)
      .map((n) => n.id)

    await this.deleteNodeByIds(ids)
    await this.deleteNode(id)
    await this.addChange(id, OperationType.DELETE)
  }

  listJournals = (areaId: string) => {
    return this.queryNode<IJournalNode>({ type: NodeType.JOURNAL, areaId })
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

    await this.addChange(tag.id, OperationType.CREATE, tag)
  }

  updateTagProps = async (id: string, props: Partial<ITagNode['props']>) => {
    return this.updateNodeProps(id, props)
  }

  deleteTag = async (id: string) => {
    await this.addChange(id, OperationType.DELETE)
    return this.deleteNode(id)
  }

  addCreationTag = async (data: Partial<ICreationTagNode>) => {
    const creationTag = await this.addNode({
      id: uniqueId(),
      ...data,
    } as ICreationTagNode)

    await this.addChange(creationTag.id, OperationType.CREATE, creationTag)

    const creationTags = await this.queryNode<ICreationTagNode>({
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
    const creationTag = (await this.getNode(id))!
    const tagId = creationTag.props.tagId
    await this.addChange(id, OperationType.DELETE)
    await this.deleteNode(id)

    const creationTags = await this.queryNode<ICreationTagNode>({
      type: NodeType.CREATION_TAG,
    })

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
      await localDB.change.add(change)
    }
  }
}

export const db = new DB()
