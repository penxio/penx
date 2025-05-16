import { getCreations, getSite } from '@/lib/fetchers'
import { Feed } from 'feed'
import { headers } from 'next/headers'
import { CreationType } from '@penx/types'

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

  const feed = new Feed({
    title: site.name,
    description: site.name,
    id: `https://${hostname}`,
    link: `https://${hostname}`,
    // language: 'en',
    copyright: `All rights reserved 2025, ${site.name}`,
    generator: 'awesome',
    // feedLinks: {
    //   json: 'https://example.com/json',
    //   atom: 'https://example.com/atom',
    // },
    author: {
      name: site.name,
      // email: 'johndoe@example.com',
      // link: 'https://example.com/johndoe',
    },
  })

  creations
    .filter((p) => p.type === CreationType.ARTICLE)
    .slice(0, 20)
    .forEach((post) => {
      feed.addItem({
        title: post.title,
        id: post.slug,
        link: `https://${hostname}/creations/${post.slug}`,
        description: post.description,
        // content: post.content,
        date: new Date(post.publishedAt || post.createdAt),
      })
    })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
