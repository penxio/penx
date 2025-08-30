import { FeatureExtractionPipeline } from '@xenova/transformers'
import { eq } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { embeddings, nodes } from '@penx/db/schema'
import { Node } from '@penx/domain'
import { INode } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'
import { createEmbeddings } from './createEmbeddings'
import { initEmbeddings } from './initEmbeddings'
import { buildMDocumentFromCreations } from './userCreationChunk'

export async function createNodeEmbedding(
  extractor: FeatureExtractionPipeline,
  nodeRaw: INode,
) {
  const node = new Node(nodeRaw)
  if (!node.isCreation) return

  const embedding = await db.query.embeddings.findFirst({
    where: eq(embeddings.userId, node.userId),
  })

  if (!embedding) {
    await initEmbeddings()
  }

  try {
    return await db.transaction(async (tx) => {
      // Query the structure node
      const struct = await tx.query.nodes.findFirst({
        where: eq(nodes.id, node.structId),
      })

      const documents = buildMDocumentFromCreations([nodeRaw, struct])

      // Delete existing embeddings for this node
      await tx.delete(embeddings).where(eq(embeddings.nodeId, node.id))

      // Prepare data for batch insertion
      const embeddingValues: Array<{
        id: string
        nodeId: string
        userId: string
        embedding: number[]
        metadata: any
      }> = []

      // Process all documents and chunks
      for (const document of documents) {
        const chunks = await document.chunk({
          strategy: 'recursive',
          maxSize: 256,
          overlap: 32,
          keepSeparator: 'end',
        })

        // Create embeddings for each chunk
        for (const chunk of chunks) {
          const { embeddings: embeddingList } = await createEmbeddings(
            extractor,
            chunk.text,
          )

          embeddingValues.push({
            id: uniqueId(),
            nodeId: chunk.metadata.nodeId,
            userId: chunk.metadata.userId,
            embedding: embeddingList[0],
            metadata: chunk.metadata,
          })
        }
      }

      // Batch insert all embeddings
      if (embeddingValues.length > 0) {
        await tx.insert(embeddings).values(embeddingValues)
      }

      console.log(
        `Successfully created ${embeddingValues.length} embeddings for node ${node.id}`,
      )

      return documents
    })
  } catch (error) {
    console.error('Error creating embeddings for node:', node.id, error)
    throw error
  }
}
