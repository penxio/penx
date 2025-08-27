import { eq } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { embeddings, nodes } from '@penx/db/schema'
import { uniqueId } from '@penx/unique-id'
import { createEmbeddings } from './createEmbeddings'
import { loadModel } from './loadModel'
import {
  findMostSimilar,
  retrieve,
  searchSimilarContent,
  simpleRetrieve,
} from './retrieve'
import { buildMDocument } from './userCreationChunk'

export async function initEmbeddings() {
  const extractor = await loadModel()

  const lists = await db.query.embeddings.findMany()
  console.log('>>>>>>>>>>>>>>====embeddings=lists:', lists.length)

  if (lists.length) {
    // If data already exists, perform test query
    console.log('Testing embeddings search...')
    try {
      const testQuery = 'What is the bank card number?'

      // Test the new recommended method
      console.log('\n=== Using searchSimilarContent (AI SDK recommended method) ===')
      const results1 = await searchSimilarContent(extractor, testQuery, 3, 0.3)
      console.log(`Found ${results1.length} similar records:`)

      for (const result of results1) {
        console.log(
          `  Similarity: ${result.similarity.toFixed(4)}, Node: ${result.nodeId}`,
        )

        const item = await db.query.nodes.findFirst({
          where: eq(nodes.id, result.nodeId!),
        })
        console.log('=====item:', item)

        if (result.metadata) {
          console.log(
            `     Metadata preview: ${JSON.stringify(result.metadata).substring(0, 100)}...`,
          )
        }
      }

      // Test the compatibility method
      console.log('\n=== Using simpleRetrieve (compatibility method) ===')
      const results2 = await simpleRetrieve(extractor, testQuery, 3)
      console.log(`Found ${results2.length} similar records:`)
      results2.forEach((result, index) => {
        console.log(
          `  ${index + 1}. Similarity: ${result.similarity.toFixed(4)}, Node: ${result.nodeId}`,
        )
      })

      if (results1.length > 0 || results2.length > 0) {
        console.log('\n✅ Vector search test successful!')
      } else {
        console.log(
          '\n⚠️ No similar records found (this might be normal if threshold is too strict)',
        )
      }
    } catch (error) {
      console.error('❌ Vector search test failed:', error)
    }
    return
  }
  const documents = await buildMDocument()

  for (const document of documents) {
    const chunks = await document.chunk({
      strategy: 'recursive',
      size: 256,
      overlap: 32,
      separator: '\n',
    })

    //
    for (const chunk of chunks) {
      const { embeddings: embeddingList } = await createEmbeddings(
        extractor,
        chunk.text,
      )

      // console.log(
      //   '====chunk.metadata:',
      //   chunk.metadata,
      //   'chunk.text:',
      //   chunk.text,
      // )

      await db.insert(embeddings).values({
        id: uniqueId(),
        nodeId: chunk.metadata.nodeId,
        embedding: embeddingList[0],
        metadata: chunk.metadata,
      })
    }
  }
}
