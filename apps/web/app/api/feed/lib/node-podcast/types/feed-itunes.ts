import { FeedItunesCategory } from './feed-itunes-category'
import { FeedItunesOwner } from './feed-itunes-owner'
import { FeedItunesType } from './feed-itunes-type'
import { ItunesExplicit } from './itunes-explicit'

export interface FeedITunes {
  itunesAuthor?: string
  itunesSubtitle?: string
  itunesSummary?: string
  itunesOwner?: FeedItunesOwner
  itunesExplicit?: ItunesExplicit
  itunesCategory?: FeedItunesCategory[]
  itunesImage?: string
  itunesType?: FeedItunesType
}
