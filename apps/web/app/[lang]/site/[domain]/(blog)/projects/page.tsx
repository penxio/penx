import { getPage, getProjects, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'
import { defaultEditorContent } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import { FriendsProvider } from '@penx/contexts/FriendsContext'
import { ProjectsProvider } from '@penx/contexts/ProjectsContext'
import { StructType } from '@penx/types'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Projects | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const projects = await getProjects(site)
  const page = await getPage(site.id, 'projects')

  if (!page) return <div>No project page</div>

  return (
    <div className="mx-auto max-w-2xl">
      <ProjectsProvider projects={projects}>
        <ContentRender content={page?.content || defaultEditorContent} />
      </ProjectsProvider>
    </div>
  )
}
