import { pipeline } from '@xenova/transformers'

// ~/.cache/xenova/
export async function loadModel() {
  console.log('start load model..........')

  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
  )

  return extractor
}
