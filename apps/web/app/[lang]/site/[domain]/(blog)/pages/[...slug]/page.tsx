import { CreationProvider } from '@penx/contexts/CreationContext'
import { PageDefaultUI } from '@penx/components/PageDefaultUI'
import { getPage, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'

type Params = Promise<{ domain: string; slug: string[]; lang: string }>

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const params = await props.params
  const site = await getSite(params)
  const slug = decodeURI(params.slug.join('/'))
  const page = await getPage(site.id, slug)

  return {
    title: page?.title || site.seoTitle,
    description: page?.title || site.seoDescription,
  }
}

export async function generateStaticParams() {
  return []
}

export default async function Page(props: { params: Params }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const site = await getSite(params)
  const page = await getPage(site.id, slug)

  const { PageDetail } = loadTheme('garden')
  if (!PageDetail) return <PageDefaultUI content={page!.content} />

  return (
    <CreationProvider creation={page as any}>
      <PageDetail content={page!.content} page={page} />
    </CreationProvider>
  )
}
