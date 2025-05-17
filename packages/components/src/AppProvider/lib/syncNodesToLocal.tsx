'use client'

import isEqual from 'react-fast-compare'
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
import { SHAPE_URL } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { localDB } from '@penx/local-db'
import { ICreationNode, INode, NodeType } from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { store } from '@penx/store'
import { AsyncQueue } from './AsyncQueue'
import { isRowsEqual } from './isRowsEqual'
import { getElectricSyncState, setElectricSyncState } from './syncState'

const queue = new AsyncQueue()

export async function syncNodesToLocal(siteId: string) {
  // await tryToSyncInitialData(siteId)
  // return
  const { last_lsn, ...metadata } = await getElectricSyncState()
  // console.log('========syncState:', metadata, 'last_lsn:', last_lsn)

  const stream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: 'node',
      where: `"siteId" = '${siteId}'`,
    },
    ...metadata,
  })

  /** init data (first time) */
  {
    const nodes = await localDB.listNodes(siteId)
    const site = nodes.find((n) => n.type === NodeType.SITE)

    if (!nodes?.length || !site) {
      // await localDB.node.where({ siteId }).delete()

      console.log('First time sync......')

      const shape = new Shape(stream)
      const rows = await shape.rows
      await localDB.node.bulkPut(rows as any)
    }
  }

  // shape.subscribe(async ({ rows }) => {
  //   console.log('>>>>>>>>==creation row:', rows)
  // })

  stream.subscribe(async (messages) => {
    queue.addTask(() => sync(siteId, stream, messages))
  })

  const site = await localDB.getSite(siteId)
  return site
}

async function sync(
  siteId: string,
  stream: ShapeStream<Row<never>>,
  messages: Message<Row<never>>[],
) {
  console.log('=======>>>>>>messages:', messages)
  const { changes, lsn } = handleMessages(messages)

  console.log('========changes:', changes, 'lsn:', lsn)
  if (!changes.length) return
  const state = await getElectricSyncState()

  if (lsn && state?.last_lsn && BigInt(lsn) <= BigInt(state.last_lsn)) {
    return
  }

  try {
    const changeNodes: INode[] = []

    let updated = false
    const nodes = await localDB.listNodes(siteId)
    await localDB.transaction('rw', localDB.node, async () => {
      for (const message of changes) {
        const value = message.value as any
        const operation = message.headers.operation
        if (operation === 'insert') {
          // console.log('insert:', message)
          await localDB.node.put(value)
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
              return !isEqual(value[key], (node as any)[key])
            })

          // console.log('=====changed:', changed)

          if (changed) {
            node && changeNodes.push(node)
          }

          await localDB.node.update(value.id, value)
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

    console.log('synced:', updated, '=====changeNodes:', changeNodes)

    await setElectricSyncState({
      handle: stream.shapeHandle!,
      offset: stream.lastOffset,
      last_lsn: lsn,
    })

    const hasCreations = changeNodes.some((c) => c.type === NodeType.CREATION)
    if (hasCreations) {
      await store.creations.refetchCreations()
    }

    const hasAreas = changeNodes.some((c) => c.type === NodeType.AREA)
    if (hasAreas) {
      // await store.areas.refetchAreas()
    }

    const hasStructs = changeNodes.some((c) => c.type === NodeType.STRUCT)
    if (hasStructs) {
      // await store.structs.refetchStructs()
    }

    // TODO:
    // const panels = store.panels.get()
    // for (const panel of panels) {
    //   const creation = changeNodes.find((c) => c.id === panel.creationId)
    //   if (creation) {
    //     appEmitter.emit('PANEL_CREATION_UPDATED', creation as ICreationNode)
    //   }
    // }
  } catch (error) {
    console.error(error)
  }
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
