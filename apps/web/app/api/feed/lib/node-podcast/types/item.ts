import { FeedCustomElement } from './feed-custom-element'
import { ItemEnclosure } from './item-enclosure'
import { ItemITunes } from './item-itunes'
import { ItemSimpleChapters } from './item-simple-chapters'

export interface Item extends ItemITunes, ItemSimpleChapters {
  /** Title of this particular item. */
  title: string
  /** Content for the item. Can contain html but link and image urls must be absolute path including hostname. */
  description: string
  /** Url to the item. This could be a blog entry. */
  url: string
  /** A unique string feed readers use to know if an item is new or has already been seen. If you use a guid never change it. If you don't provide a guid then your item urls must be unique. */
  guid: string
  /** If provided, each array item will be added as a category element. */
  categories?: string[]
  /** If included it is the name of the item's creator. If not provided the item author will be the same as the feed author. This is typical except on multi-author blogs. */
  author?: string
  /** The date and time of when the item was created. Feed readers use this to determine the sort order. Some readers will also use it to determine if the content should be presented as unread. */
  date: Date | string
  /** The latitude coordinate of the item. */
  lat?: number
  /** The longitude coordinate of the item. */
  long?: number
  /** Attach a multimedia file to this item.  */
  enclosure?: ItemEnclosure
  /** Long html content for the episode */
  content?: string
  /** Small image for feed readers to use. */
  imageUrl?: string
  /** Put additional elements in the item (node-xml syntax) */
  customElements?: FeedCustomElement[]
}
