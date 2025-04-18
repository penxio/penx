import { FeedCustomElement } from './feed-custom-element'
import { FeedITunes } from './feed-itunes'
import { FeedNamespace } from './feed-namespace'

export interface Feed extends FeedITunes {
  /** Url to the rss feed. */
  feedUrl: string
  /** Url to the site that the feed is for. */
  siteUrl: string
  /** Small image for feed readers to use. */
  imageUrl?: string
  /** Title of your site or feed. */
  title: string
  /** A short description of the feed. */
  description?: string
  /** Feed generator */
  generator?: string
  /** Url to documentation on this feed. */
  docs?: string
  /** Who owns this feed. */
  author?: string
  /** Who manages content in this feed. */
  managingEditor?: string
  /** Who manages feed availability and technical support. */
  webMaster?: string
  /** Copyright information for this feed. */
  copyright?: string
  /** The language of the content of this feed. */
  language?: string
  /** One or more categories this feed belongs to. */
  categories?: string[]
  /** The publication date for content in the feed */
  pubDate?: Date | string
  /** Number of minutes feed can be cached before refreshing from source. */
  ttl?: number
  /** Set this to true to force the GeoRSS namespace */
  geoRSS?: boolean
  /** Put additional namespaces in element (without 'xmlns:' prefix) */
  customNamespaces: FeedNamespace
  /** Put additional elements in the feed (node-xml syntax) */
  customElements: FeedCustomElement[]
}
