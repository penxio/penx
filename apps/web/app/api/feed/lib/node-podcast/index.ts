import RSS from '../rss'
import { buildITunesCategoryElements } from './build-itunes-category-elements'
import { buildSimpleChaptersElement } from './build-simple-chapters-element'
import deprecate from './deprecate'
import durationFormat from './duration-format'
import {
  Feed,
  FeedCustomElement,
  FeedNamespace,
  FeedOptions,
  Item,
  ItemOptions,
} from './types/index'

export * from './types/index'

export class Podcast {
  feed: Feed
  items: Item[] = []
  options: FeedOptions = {}

  constructor(
    options: FeedOptions = {},
    items: ReadonlyArray<ItemOptions> = [],
  ) {
    this.options = this.getOptionDefaults(options)
    this.feed = this.init(this.options, items)
  }

  protected getOptionDefaults(_options: FeedOptions): FeedOptions {
    const options: FeedOptions = {
      ..._options,
      title: _options.title || 'Untitled Podcast Feed',
      description: _options.description || '',
      feedUrl: _options.feedUrl || '',
      siteUrl: _options.siteUrl || '',
      generator: _options.generator || 'Podcast for Node',
      customElements: _options.customElements || [],
      customNamespaces: {
        ..._options.customNamespaces,
      },
    }

    options.itunesOwner = options.itunesOwner

    options.namespaces = options.namespaces || {}

    if (typeof options.namespaces.iTunes === 'undefined') {
      options.namespaces.iTunes = true
    }

    if (typeof options.namespaces.podcast === 'undefined') {
      options.namespaces.podcast = true
    }

    if (typeof options.namespaces.simpleChapters === 'undefined') {
      options.namespaces.simpleChapters = true
    }

    return options
  }

  protected getNamespaces(options: FeedOptions) {
    const namespaces: FeedNamespace = {
      ...options.customNamespaces,
    }
    if (options.namespaces?.iTunes) {
      namespaces.itunes = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    }
    if (options.namespaces?.simpleChapters) {
      namespaces.psc = 'http://podlove.org/simple-chapters'
    }
    if (options.namespaces?.podcast) {
      namespaces.podcast = 'https://podcastindex.org/namespace/1.0'
    }
    return namespaces
  }

  protected getITunesFeedElements(options: FeedOptions) {
    const customElements: FeedCustomElement[] = []

    if (options.itunesAuthor || options.author) {
      customElements.push({
        'itunes:author': options.itunesAuthor || options.author,
      })
    }

    if (options.itunesSubtitle) {
      customElements.push({
        'itunes:subtitle': options.itunesSubtitle,
      })
    }

    if (options.itunesSummary || options.description) {
      customElements.push({
        'itunes:summary': options.itunesSummary || options.description,
      })
    }

    if (options.itunesType) {
      customElements.push({
        'itunes:type': options.itunesType,
      })
    }

    if (options.itunesOwner) {
      customElements.push({
        'itunes:owner': [
          { 'itunes:name': options.itunesOwner?.name || '' },
          { 'itunes:email': options.itunesOwner?.email || '' },
        ],
      })
    }

    customElements.push({
      'itunes:explicit':
        typeof options.itunesExplicit === 'boolean'
          ? !!options.itunesExplicit
          : options.itunesExplicit || false,
    })

    if (options.itunesCategory) {
      const categories = buildITunesCategoryElements(options.itunesCategory)
      categories.forEach((category) => {
        customElements.push(category)
      })
    }

    if (options.itunesImage || options.imageUrl) {
      customElements.push({
        'itunes:image': {
          _attr: {
            href: options.itunesImage || options.imageUrl,
          },
        },
      })
    }

    return customElements
  }

  init(options: FeedOptions, items: ReadonlyArray<ItemOptions> = []) {
    const feed: Partial<Feed> = {
      ...this.options,
    }

    feed.customNamespaces = {
      ...this.getNamespaces(options),
    }

    if (options.namespaces?.iTunes) {
      feed.customElements = [
        ...(feed.customElements || []),
        ...this.getITunesFeedElements(options),
      ]
    }

    this.items = []
    const initialItems = items
    initialItems.forEach((item) => this.addItem(item))

    return feed as Feed
  }

  protected getITunesItemElements(itemOptions: ItemOptions) {
    const customElements: FeedCustomElement[] = []

    if (itemOptions.itunesAuthor || itemOptions.author) {
      customElements.push({
        'itunes:author': itemOptions.itunesAuthor || itemOptions.author,
      })
    }
    if (itemOptions.itunesSubtitle) {
      customElements.push({
        'itunes:subtitle': itemOptions.itunesSubtitle,
      })
    }
    if (itemOptions.itunesSummary || itemOptions.description) {
      customElements.push({
        'itunes:summary': itemOptions.itunesSummary || itemOptions.description,
      })
    }
    customElements.push({
      'itunes:explicit':
        typeof itemOptions.itunesExplicit === 'boolean'
          ? !!itemOptions.itunesExplicit
          : itemOptions.itunesExplicit || false,
    })
    if (itemOptions.itunesDuration) {
      customElements.push({
        'itunes:duration': durationFormat(itemOptions.itunesDuration),
      })
    }
    if (itemOptions.itunesKeywords) {
      deprecate({ name: 'itunesKeywords', type: 'option' })
      customElements.push({
        'itunes:keywords': itemOptions.itunesKeywords,
      })
    }
    if (itemOptions.itunesImage || itemOptions.imageUrl) {
      customElements.push({
        'itunes:image': {
          _attr: {
            href: itemOptions.itunesImage || itemOptions.imageUrl,
          },
        },
      })
    }
    if (itemOptions.itunesSeason)
      customElements.push({ 'itunes:season': itemOptions.itunesSeason })
    if (itemOptions.itunesEpisode)
      customElements.push({ 'itunes:episode': itemOptions.itunesEpisode })
    if (itemOptions.itunesTitle)
      customElements.push({ 'itunes:title': itemOptions.itunesTitle })
    if (itemOptions.itunesEpisodeType) {
      customElements.push({
        'itunes:episodeType': itemOptions.itunesEpisodeType,
      })
    }
    if (itemOptions.itunesNewFeedUrl) {
      customElements.push({
        'itunes:new-feed-url': itemOptions.itunesNewFeedUrl,
      })
    }

    return customElements
  }

  addItem(itemOptions: ItemOptions): void {
    const item: ItemOptions = { ...itemOptions }
    item.customElements = item.customElements || []
    if (itemOptions.content) {
      item.customElements.push({
        'content:encoded': {
          _cdata: itemOptions.content,
        },
      })
    }

    if (this.options.namespaces?.iTunes) {
      item.customElements = [
        ...(item.customElements || []),
        ...this.getITunesItemElements(itemOptions),
      ]
    }

    if (this.options.namespaces?.simpleChapters && itemOptions.pscChapters) {
      item.customElements = [
        ...(item.customElements || []),
        buildSimpleChaptersElement(itemOptions.pscChapters),
      ]
    }

    this.items.push(item as Item)
    return
  }

  buildXml(options: { indent?: string } = {}) {
    const rss = new RSS({
      ...this.feed,
      feed_url: this.feed.feedUrl,
      site_url: this.feed.siteUrl,
      custom_elements: this.feed.customElements,
      custom_namespaces: this.feed.customNamespaces,
    })
    this.items.forEach((item) =>
      rss.item({
        ...item,
        custom_elements: item.customElements,
      }),
    )
    return rss.xml(options)
  }
}
