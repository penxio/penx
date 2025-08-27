import { db } from '@penx/db/client'
import { embeddings } from '@penx/db/schema'
import { uniqueId } from '@penx/unique-id'
import { createEmbeddings } from './createEmbeddings'
import { loadModel } from './loadModel'
import { buildMDocument } from './userCreationChunk'

export async function initEmbeddings() {
  const extractor = await loadModel()

  // const rows = await retrieve('银行卡号是什么？')
  // console.log('======rows:', rows)

  const lists = await db.query.embeddings.findMany()
  console.log('>>>>>>>>>>>>>>====embeddings=lists:', lists.length)
  if (lists.length) return
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
