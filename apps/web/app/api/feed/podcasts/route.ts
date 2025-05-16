import { getCreations, getSite } from '@/lib/fetchers'
import { headers } from 'next/headers'
import { CreationType } from '@penx/types'
import { getUrl } from '@penx/utils'
import { Podcast } from '../lib/node-podcast'

// import RSS from '../lib/rss'

export async function GET(req: Request) {
  const headersList = await headers()
  const hostname = headersList.get('host')

  const isRoot =
    hostname === 'localhost:4000' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN

  if (isRoot) {
    return new Response('This is a root domain', {
      status: 200,
    })
  }

  const site = await getSite({ domain: hostname })
  const creations = await getCreations(site)

  const feedUrl = `https://${hostname}/podcasts/feed.xml`

  /* lets create an rss feed */
  const feed = new Podcast({
    title: site.name,
    description: site.name,
    feedUrl,
    siteUrl: `https://${hostname}`,
    imageUrl: getUrl(site.logo || '') || '',
    // docs: 'http://example.com/rss/docs.html',
    author: site.name,
    // managingEditor: '',
    // webMaster: '',
    // copyright: '2024 Dylan Greene',
    language: 'en',
    categories: [],
    pubDate: 'May 20, 2024 04:00:00 GMT',
    ttl: 60,
    itunesAuthor: site.name,
    itunesSubtitle: site.description,
    itunesSummary: site.description,
    itunesOwner: { name: '', email: '' },
    itunesExplicit: false,
    itunesCategory: [
      {
        text: 'Entertainment',
        subcats: [
          {
            text: 'Television',
          },
        ],
      },
    ],
    itunesImage: getUrl(site.logo || '') || '',
  })

  creations
    .filter((p) => p.type === CreationType.AUDIO)
    .slice(0, 20)
    .forEach((post) => {
      const author = post.authors[0]?.user?.name || site.name
      feed.addItem({
        title: post.title,
        guid: post.slug,
        description: post.description,
        url: `https://${hostname}/creations/${post.slug}`,
        categories: [], // optional - array of item categories
        author,
        date: new Date(post.publishedAt || post.createdAt),
        // lat: 33.417974, //optional latitude field for GeoRSS
        // long: -111.933231, //optional longitude field for GeoRSS
        // enclosure: { url: '...', file: 'path-to-file' }, // optional enclosure
        itunesAuthor: author,
        itunesExplicit: false,
        itunesSubtitle: post.description,
        itunesSummary: post.description,
        itunesDuration: (post.podcast as any)?.duration,
        itunesNewFeedUrl: feedUrl,
      })
    })

  // cache the xml to send to clients
  const xml = feed.buildXml()

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
