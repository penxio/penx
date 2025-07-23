'use client'

import fastCompare from 'react-fast-compare'
import {
  ChangeMessage,
  isChangeMessage,
  isControlMessage,
  Message,
  Row,
  Shape,
  ShapeStream,
  ShapeStreamOptions,
} from '@electric-sql/client'
import { get } from 'idb-keyval'
import { SHAPE_URL } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { localDB } from '@penx/local-db'
import {
  ICreationNode,
  IJournalNode,
  INode,
  isAreaNode,
  isCreationNode,
  isCreationTagNode,
  isStructNode,
  isTagNode,
  NodeType,
} from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { getSession } from '@penx/session'
import { store } from '@penx/store'
import { AsyncQueue } from './AsyncQueue'
import { isRowsEqual } from './isRowsEqual'
import { getElectricSyncState, setElectricSyncState } from './syncState'

const queue = new AsyncQueue()

export async function syncNodesToLocal(spaceId: string) {
  const { last_lsn, ...metadata } = await getElectricSyncState(spaceId)
  console.log('========last_lsn:', last_lsn, 'metadata:', metadata)

  const getShapeUrl = async () => {
    const session = await getSession()
    if (session.syncServer?.host && session.syncServer?.enabled) {
      return `${session.syncServer.host}/api/v1/shape`
    }
    return SHAPE_URL
  }

  const shapeUrl = await getShapeUrl()

  console.log('======getShapeUrl:', shapeUrl)
  const session = await get('SESSION')

  const stream = new ShapeStream({
    url: shapeUrl,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },

    params: {
      table: 'node',
      where: `"spaceId" = '${spaceId}'`,
    },
    ...metadata,
  })

  /** init data (first time) */
  {
    const nodes = await localDB.listSpaceNodes(spaceId)
    const site = nodes.find((n) => n.type === NodeType.SPACE)

    // console.log('=====nodes:', nodes, 'site:', site)

    if (!nodes?.length || !site) {
      // await localDB.node.where({ spaceId }).delete()

      console.log('First time sync......')

      const shape = new Shape(stream)
      const rows = await shape.rows
      console.log('=======rows:', rows)

      await localDB.node.bulkPut(
        rows.map(
          (row) =>
            ({
              ...row,
              createdAt: new Date(Number(row.createdAt?.toString())),
              updatedAt: new Date(Number(row.updatedAt?.toString())),
            }) as any,
        ),
      )
    }
  }

  // shape.subscribe(async ({ rows }) => {
  //   console.log('>>>>>>>>==creation row:', rows)
  // })

  stream.subscribe(async (messages) => {
    queue.addTask(() => sync(spaceId, stream, messages))
  })

  appEmitter.on('STOP_SYNC_NODES', () => {
    stream.unsubscribeAll()
  })

  const site = await localDB.getSpace(spaceId)
  return site
}

async function sync(
  spaceId: string,
  stream: ShapeStream<Row<never>>,
  messages: Message<Row<never>>[],
) {
  // console.log('=======>>>>>>messages:', messages)
  const { changes, lsn } = handleMessages(messages)

  console.log('========changes:', changes)
  if (!changes.length) return
  const state = await getElectricSyncState(spaceId)

  if (lsn && state?.last_lsn && BigInt(lsn) <= BigInt(state.last_lsn)) {
    return
  }

  const changeNodes: INode[] = []

  let updated = false
  const nodes = await localDB.listSpaceNodes(spaceId)

  const isInsertedOrUpdate = !changes.some(
    (c) => c.headers.operation === 'delete',
  )

  console.log('========changes:isInsertedOrUpdate', isInsertedOrUpdate)
  if (isInsertedOrUpdate && state?.last_lsn) {
    const localLatestUpdated = Math.max(
      ...nodes.map((n) => new Date(n.updatedAt).getTime()),
    )

    const changesLatestUpdated = Math.max(
      ...changes.map((c: any) => Number(c.value.updatedAt.toString())),
    )

    console.log(
      '========changes:-------localLatestUpdated:',
      localLatestUpdated,
      changesLatestUpdated,
      localLatestUpdated >= changesLatestUpdated,
      localLatestUpdated - changesLatestUpdated,
    )

    if (localLatestUpdated >= changesLatestUpdated) return
  }

  await localDB.transaction('rw', localDB.node, async () => {
    for (const message of changes) {
      const value = message.value as any
      const operation = message.headers.operation
      if (operation === 'insert') {
        // console.log('insert:', message)

        await localDB.node.put({
          ...value,
          createdAt: new Date(Number(value.createdAt.toString())),
          updatedAt: new Date(Number(value.updatedAt.toString())),
        })

        const newNode = await localDB.node.get(value.id)
        newNode && changeNodes.push(newNode)
        updated = true // TODO:
      }
      if (operation === 'update') {
        const node = nodes.find((c) => c.id === value.id)
        const changed = Object.keys(value)
          .filter((k) => k !== 'updatedAt')
          .some((key) => {
            if (!node) return true
            // console.log('=====value[key]:', value[key], creation[key])
            return !fastCompare(value[key], (node as any)[key])
          })

        // console.log('=====changed:', changed)

        if (changed) {
          node && changeNodes.push(node)
        }

        await localDB.node.update(value.id, {
          ...value,
          updatedAt: new Date(Number(value.updatedAt.toString())),
        })
      }
      if (operation === 'delete') {
        const node = nodes.find((c) => c.id === value.id)
        node && changeNodes.push(node)

        // console.log('message delete:', message)
        await localDB.node.delete(value.id)
        updated = true // TODO:
      }
    }
  })

  // console.log('synced:', updated, '=====changeNodes:', changeNodes)
  // console.log('======>>>>>>>>equal1:', changeNodes)

  await setElectricSyncState(spaceId, {
    handle: stream.shapeHandle!,
    offset: stream.lastOffset,
    last_lsn: lsn,
  })

  // {
  //   const nodes = await localDB.listSiteNodes(spaceId)

  //   // console.log('=====creations:', creations, store.creations.get())

  //   const journal = store.journals.getActiveJournal()
  //   console.log('======journal:', journal)

  //   if (journal) {
  //     const localJournal = nodes.find((c) => c.id === journal.id)!
  //     console.log('=====localJournal:', localJournal)

  //     if (!fastCompare(journal.props.children, localJournal.props.children)) {
  //       // updateJournal(localJournal as IJournalNode)
  //       store.journals.refetchJournals()
  //     }
  //   }
  // }

  const hasCreations = changeNodes.some((c) => c.type === NodeType.CREATION)
  if (hasCreations) {
    await store.creations.refetchCreations()
  }

  const hasAreas = changeNodes.some((c) => c.type === NodeType.AREA)
  if (hasAreas) {
    await store.areas.refetchAreas()
  }

  const hasStructs = changeNodes.some((c) => c.type === NodeType.STRUCT)
  if (hasStructs) {
    await store.structs.refetchStructs()
  }

  const hasTags = changeNodes.some((c) => c.type === NodeType.TAG)
  if (hasTags) {
    await store.tags.refetchTags()
  }

  const hasCreationTags = changeNodes.some(
    (c) => c.type === NodeType.CREATION_TAG,
  )
  if (hasCreationTags) {
    await store.creationTags.refetchCreationTags()
  }

  const hasJournals = changeNodes.some((c) => c.type === NodeType.JOURNAL)
  if (hasJournals) {
    await store.journals.refetchJournals()
  }

  // TODO:
  // const panels = store.panels.get()
  // for (const panel of panels) {
  //   const creation = changeNodes.find((c) => c.id === panel.creationId)
  //   if (creation) {
  //     appEmitter.emit('PANEL_CREATION_UPDATED', creation as ICreationNode)
  //   }
  // }
}

function handleMessages(messages: Message<Row<never>>[], debug = true) {
  let lsn: string = ''
  let changes: ChangeMessage[] = []
  for (const message of messages) {
    if (isChangeMessage(message)) {
      changes.push(message)
    } else if (isControlMessage(message)) {
      switch (message.headers.control) {
        case 'up-to-date': {
          if (debug) {
            console.log('received up-to-date', message)
          }
          if (typeof message.headers.global_last_seen_lsn !== `string`) {
            throw new Error(`global_last_seen_lsn is not a string`)
          }
          // const globalLastSeenLsn = BigInt(
          //   message.headers.global_last_seen_lsn,
          // if (globalLastSeenLsn <= lastCommittedLsnForShape) {
          //   // We are replaying changes / have already seen this lsn
          //   // skip and move on to the next message
          //   return
          // }
          lsn = message.headers.global_last_seen_lsn
          break
        }
        case 'must-refetch': {
          // Reset the changes for this shape
          if (debug) {
            console.log('received must-refetch', message)
          }
          changes = []
          break
        }
      }
    }
  }
  return { lsn, changes }
}

function formatList(arr: any[]) {
  return [...arr]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((i) => i.props)
    .map((v) => {
      return Object.keys(v)
        .filter((k) => k !== 'updatedAt')
        .sort()
        .map((k) => v[k])
    })
}

// TODO:
function isEqual(localArr: INode[], storeArr: INode[]): boolean {
  const p1 = formatList(localArr)
  const p2 = formatList(storeArr)
  return fastCompare(p1, p2)
}
