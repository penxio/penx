import { initLingui } from '@/initLingui'
import {
  getCreations,
  getFriends,
  getPage,
  getPodcasts,
  getProjects,
  getSite,
  getTags,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { redirectTo404 } from '@/lib/redirectTo404'
import { Metadata } from 'next'
import { GridLayoutUI } from '@penx/components/GridLayoutUI'
import { ROOT_DOMAIN } from '@penx/constants'
import { CreationsProvider } from '@penx/contexts/CreationsContext'
import { FriendsProvider } from '@penx/contexts/FriendsContext'
import { ProjectsProvider } from '@penx/contexts/ProjectsContext'
import linguiConfig from '@penx/libs/lingui.config'
import { AppearanceConfig, CreationType, DesignMode } from '@penx/types'

type Params = Promise<{ domain: string; lang: string }>

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const site = await getSite(await params)

  return {
    title: site?.seoTitle || '',
    description: site?.seoDescription || '',
  }
}

export default async function HomePage(props: {
  params: Promise<{ domain: string; lang: string }>
}) {
  const params = await props.params
  const site = await getSite(params)
  if (!site) return redirectTo404()

  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const [creations, podcasts, tags, friends, projects, about] =
    await Promise.all([
      getCreations(site),
      getPodcasts(site),
      getTags(site.id),
      getFriends(site),
      getProjects(site),
      getPage(site.id, 'about'),
    ])

  const { HomePage } = loadTheme('garden')

  if (!HomePage) {
    return <div>Theme not found</div>
  }

  let Home =
    site.theme?.common?.designMode === DesignMode.GRID ? GridLayoutUI : HomePage

  return (
    <ProjectsProvider projects={projects}>
      <FriendsProvider friends={friends}>
        <Home
          creations={creations}
          podcasts={podcasts}
          tags={tags}
          friends={friends}
          projects={projects}
          authors={[]}
          site={site}
          about={about}
        />
      </FriendsProvider>
    </ProjectsProvider>
  )
}
