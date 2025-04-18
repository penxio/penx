import { Feed } from './feed'
import { FeedNamespaceOptions } from './feed-namespace-options'

export interface FeedOptions extends Partial<Feed> {
  /** Namespace options to enable iTunes, simpleChapters or podcast namespaces */
  namespaces?: FeedNamespaceOptions
}
