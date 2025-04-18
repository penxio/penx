import { FeedItunesCategory, FeedItunesCategoryElements } from './types/index'

export const buildITunesCategoryElements = (
  categories: FeedItunesCategory[],
) => {
  const arr: FeedItunesCategoryElements[] = []
  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (category.subcats) {
        const elements: FeedItunesCategoryElements[] = [
          { _attr: { text: category.text } },
        ]
        const cats = buildITunesCategoryElements(category.subcats)
        elements.push(...cats)
        arr.push({ 'itunes:category': elements })
      } else {
        arr.push({ 'itunes:category': { _attr: { text: category.text } } })
      }
    }
  }
  return arr
}
