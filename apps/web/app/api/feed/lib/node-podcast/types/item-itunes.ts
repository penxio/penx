import { ItunesExplicit } from './itunes-explicit'

export interface ItemITunes {
  /** (iTunes specific) author of the podcast */
  itunesAuthor?: string
  /** (iTunes specific) specifies if the podcast contains explicit content */
  itunesExplicit?: ItunesExplicit
  /** (iTunes specific) subtitle for iTunes listing */
  itunesSubtitle?: string
  /** (iTunes specific) summary for iTunes listing */
  itunesSummary?: string
  /** (iTunes specific) duration of the podcast item in seconds */
  itunesDuration?: number | string
  /** (iTunes specific) link to an image for the item */
  itunesImage?: string
  /** (iTunes specific) season number (non-zero integer) */
  itunesSeason?: number
  /** (iTunes specific) episode number (non-zero integer) */
  itunesEpisode?: number
  /** (iTunes specific) episode title */
  itunesTitle?: string
  /** (iTunes specific) The new podcast RSS Feed URL. */
  itunesNewFeedUrl?: string
  /** (iTunes specific) Keywords to find you feed in iTunes, e.g. Technology */
  itunesKeywords?: string
  /** (iTunes specific) the type of episode (full (default), trailer, bonus) */
  itunesEpisodeType?: 'full' | 'trailer' | 'bonus'
}
