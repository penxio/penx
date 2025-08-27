import { FeatureExtractionPipeline } from '@xenova/transformers'

export const createEmbeddings = async (
  extractor: FeatureExtractionPipeline,
  texts: string[] | string,
) => {
  const result = await extractor(texts, {
    pooling: 'mean',
    normalize: true,
  })

  const embeddings: number[][] = result.tolist()
  // console.log('======embeddings.length:', embeddings.length)

  return { embeddings }
}
