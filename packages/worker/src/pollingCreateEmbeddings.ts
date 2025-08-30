import { gte } from 'drizzle-orm'
import { get } from 'idb-keyval'
import ky from 'ky'
import { api } from '@penx/api'
import { isDesktop } from '@penx/constants'
import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'
import { Node } from '@penx/domain'
import { calculateSHA256FromString } from '@penx/encryption'
import { INode } from '@penx/model-type'
import { sleep } from '@penx/utils'
import { embeddedCache } from './lib/EmbeddedCache'

export async function pollingCreateEmbeddings() {
  let pollingInterval = 10 * 1000

  console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    try {
      await createEmbeddings()
    } catch (error) {
      console.log('pollingSyncToRemote error:', error)
    }
    await sleep(pollingInterval)
  }
}

async function createEmbeddings() {
  console.log('start to createEmbeddings...........')

  const db = createProxyClient()

  // Calculate timestamp for 5 minutes ago
  const fiveMinutesAgo = new Date(Date.now() - 50 * 60 * 1000)

  // Query nodes modified in the past 5 minutes
  const recentlyModifiedNodes = await db
    .select()
    .from(nodes)
    .where(gte(nodes.updatedAt, fiveMinutesAgo))

  // const structNodes = recentlyModifiedNodes.map((n) => {
  //   const node = new Node(n as INode)
  //   if (node.isStruct) return node.id
  // })

  console.log(
    `Found ${recentlyModifiedNodes.length} nodes modified in the past 5 minutes`,
  )

  // TODO: Process these nodes for embedding creation
  for (const node of recentlyModifiedNodes) {
    const hash = calculateSHA256FromString(JSON.stringify(node))
    if (await embeddedCache.has(hash)) continue

    await ky
      .post('http://localhost:14158/api/rag/createEmbedding', {
        json: { node },
      })
      .json()

    await embeddedCache.push(hash)
  }
}
