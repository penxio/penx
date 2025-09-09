import { FeatureExtractionPipeline } from '@xenova/transformers'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { nodes } from '@penx/db/schema'
import { ICreationNode, NodeType } from '@penx/model-type'
import { searchSimilarContent } from './embeddings/retrieve'
import { userCreationConvert } from './embeddings/userCreationChunk'

export async function retrieveCreations(
  extractor: FeatureExtractionPipeline,
  text: string,
) {
  const t0 = Date.now()
  // const extractor = await loadModel()
  const t1 = Date.now()
  const results = await searchSimilarContent(extractor, text, 3, 0.3)
  const t2 = Date.now()
  const nodeIds = results.map((i) => i.nodeId!)

  console.log('=======>>>>>t2-t0:', t2 - t0)

  const nodeList = (await db.query.nodes.findMany({
    where: and(eq(nodes.type, NodeType.CREATION), inArray(nodes.id, nodeIds)),
  })) as ICreationNode[]

  const structIds = Array.from(new Set(nodeList.map((i) => i.props.structId)))

  const structList = (await db.query.nodes.findMany({
    where: and(inArray(nodes.id, structIds)),
  })) as ICreationNode[]

  return userCreationConvert([...structList, ...nodeList])
}
