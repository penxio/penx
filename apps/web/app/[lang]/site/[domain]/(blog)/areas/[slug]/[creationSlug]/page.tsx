import { CreationProvider } from '@/components/CreationContext'
import { FriendsProvider } from '@/components/FriendsContext'
import { ProjectsProvider } from '@/components/ProjectsContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Footer } from '@/components/theme-ui/Footer'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PostActions } from '@/components/theme-ui/PostActions'
import { PostMetadata } from '@/components/theme-ui/PostMetadata'
import { PostSubtitle } from '@/components/theme-ui/PostSubtitle'
import { Toc } from '@/components/theme-ui/Toc'
import { initLingui } from '@/initLingui'
import {
  getArea,
  getCreation,
  getCreations,
  getFriends,
  getProjects,
  getSite,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { AreaType, Creation, GateType } from '@penx/db/client'
import { produce } from 'immer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'

type Params = Promise<{
  domain: string
  slug: string
  lang: string
  creationSlug: string
}>

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

// export async function generateMetadata(props: {
//   params: Promise<Params>
// }): Promise<Metadata> {
//   const params = await props.params
//   const site = await getSite(params)
//   const slug = decodeURI(params.slug.join('/'))
//   const post = await getPost(site.id, slug)
//   return {
//     title: post?.title || site.seoTitle,
//     description: post?.description || site.seoDescription,
//   }
// }

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

  const creationSlug = decodeURI(params.creationSlug)
  console.log('======creationSlug:', creationSlug)

  const isFriends = creationSlug === 'friends'
  let friends: any = isFriends ? await getFriends(site) : []

  const isProjects = creationSlug === 'projects'
  let projects: any = isProjects ? await getProjects(site) : []

  const [rawCreation, area] = await Promise.all([
    getCreation(site.id, creationSlug),
    getArea(site.id, params.slug),
  ])

  if (!rawCreation) {
    return notFound()
  }

  const creation: any = produce(rawCreation, (draft) => {
    draft.content = JSON.parse(draft.content)
    ;(draft as any).readingTime = readingTime(draft.content)
    return draft
  })

  return (
    <CreationProvider creation={creation}>
      <div className="flex gap-x-16 pt-4">
        <div className={cn('mx-auto flex max-w-2xl flex-1 flex-col')}>
          <div className="mb-auto flex-1">
            <header className="space-y-4 pb-4">
              <div className="mb-20">
                <PageTitle className="mb-2 mt-0 text-center">
                  {creation.title}
                </PageTitle>
                {creation.description && (
                  <PostSubtitle className="text-center">
                    {creation.description}
                  </PostSubtitle>
                )}
              </div>
              <PostMetadata site={site} creation={creation} />
              <PostActions creation={creation} />
            </header>
            <div className="pt-2 md:pt-4">
              <div className="">
                <FriendsProvider friends={friends}>
                  <ProjectsProvider projects={projects}>
                    <ContentRender content={creation.content} />
                  </ProjectsProvider>
                </FriendsProvider>
              </div>
            </div>
          </div>

          {area?.type === AreaType.BOOK && (
            <Footer className="mt-auto" site={site} />
          )}
        </div>
        {area?.type === AreaType.BOOK && (
          <Toc
            content={creation.content}
            className="sticky top-20 hidden w-56 overflow-y-auto py-10 pl-6 xl:block"
            style={{
              height: 'calc(100vh - 4rem)',
            }}
          />
        )}
      </div>
    </CreationProvider>
  )
}
