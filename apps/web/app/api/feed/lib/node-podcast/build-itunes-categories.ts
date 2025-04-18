import { FeedItunesCategory } from './types/feed-itunes-category'
import { FeedItunesCategoryTransformed } from './types/feed-itunes-category-transformed'

export const buildITunesCategories = (categories: FeedItunesCategory[]) => {
  const arr: FeedItunesCategoryTransformed[] = []
  if (Array.isArray(categories)) {
    categories.forEach((category) => {
      if (category.subcats) {
        const elements: FeedItunesCategoryTransformed[] = [
          { _attr: { text: category.text } },
        ]
        const cats = buildITunesCategories(category.subcats)
        elements.push(...cats)
        // cats.forEach((cat) => {
        //   elements.push(cat);
        // });
        arr.push({ 'itunes:category': elements })
      } else {
        arr.push({ 'itunes:category': { _attr: { text: category.text } } })
      }
    })
  }
  return arr
}
