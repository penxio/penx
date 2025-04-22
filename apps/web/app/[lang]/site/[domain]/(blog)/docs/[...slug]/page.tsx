import { initLingui } from '@/initLingui'
import { getCreation, getCreations, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { GateType } from '@prisma/client'
import { produce } from 'immer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'
import { createEditor, Editor, Element, Transforms } from 'slate'
import { CreationsProvider } from '@penx/contexts/CreationsContext'
import { AppearanceConfig, Creation, SiteCreation } from '@penx/types'
import { getUrl } from '@penx/utils'
import { PaidContent } from './PaidContent'

type Params = Promise<{ domain: string; slug: string[]; lang: string }>

function getContent(creation: Creation) {
  try {
    const content = JSON.parse(creation.content || '[]')
    return content
  } catch (error) {
    return creation.content
  }
}

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  const site = await getSite(params)
  const slug = decodeURI(params.slug.join('/'))
  const creation = await getCreation(site.id, slug)

  const title = creation?.title || site.seoTitle
  const description = creation?.description || site.seoDescription

  const image = creation?.image
    ? getUrl(creation?.image)
    : 'https://penx.io/opengraph-image'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      // creator: '@zio_penx',
    },
    metadataBase: new URL('https://penx.io'),
  }
}

// TODO:
export async function generateStaticParams() {
  return []
}

export default async function Page(props: { params: Params }) {
  const params = await props.params
  const site = await getSite(params)
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const slug = decodeURI(params.slug.join('/'))
  const [creations, rawCreation] = await Promise.all([
    getCreations(site),
    getCreation(site.id, slug),
  ])

  if (!rawCreation) {
    return notFound()
  }

  let backLinkCreations: Creation[] = []

  for (const post of creations) {
    if (post.id === rawCreation.id) continue
    try {
      const content = JSON.parse(post.content || '[]')
      const editor = createEditor()
      editor.children = content
      for (const nodeEntry of Editor.nodes(editor, {
        at: [],
        match: (node) => {
          return Element.isElement(node) && node.type === 'bidirectional_link'
        },
      })) {
        const [node] = nodeEntry
        if ((node as any).creationId === rawCreation.id) {
          const find = backLinkCreations.find((p) => p.id === post.id)
          if (!find) backLinkCreations.push(post)
        }
      }
    } catch (error) {}
  }

  const creation = produce(rawCreation, (draft) => {
    if (!lang) return draft
    if (!(draft.i18n as any)?.[lang]) return draft
    draft.title = (draft.i18n as any)?.[lang]?.title
    draft.description = (draft.i18n as any)?.[lang]?.description
    draft.content = (draft.i18n as any)?.[lang]?.content
    return draft
  })

  const postIndex = creations.findIndex((p) => p.slug === slug)
  // if (postIndex === -1 || !post) {

  const prev = creations[postIndex + 1]!
  const next = creations[postIndex - 1]!

  const { PostDetail } = loadTheme('garden')
  if (!PostDetail) throw new Error('Missing PostDetail component')

  // console.log('=====post:', post)

  /** No gated */
  if (creation?.gateType == GateType.FREE) {
    return (
      <CreationsProvider
        creations={creations as any}
        backLinkCreations={backLinkCreations as any}
      >
        <PostDetail
          site={site}
          creation={{
            ...creation,
            content: getContent(creation),
            readingTime: readingTime(creation.content),
          }}
          readable
          next={next}
          prev={prev}
        />
      </CreationsProvider>
    )
  }

  return (
    <CreationsProvider
      creations={creations as any}
      backLinkCreations={backLinkCreations as any}
    >
      <PaidContent
        site={site}
        creationId={creation.id}
        creation={creation}
        next={next}
        prev={prev}
      />
    </CreationsProvider>
  )
}
