import { ReactNode } from 'react'
import { Footer } from '@penx/components/theme-ui/Footer'
import { Site, Tag } from '@penx/types'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

interface Props {
  site: Site
  tags: Tag[]
  children: ReactNode
}

export function SiteLayout({ children, site, tags }: Props) {
  return (
    <div>
      <Header site={site} className="px-4 md:hidden" />
      <main className="relative mx-auto flex w-full max-w-5xl flex-1 gap-x-20 px-4 xl:px-0">
        <Sidebar site={site} tags={tags} />
        <div className="flex w-full flex-1 flex-col pt-0 sm:pt-16">
          <div className="flex-1">{children}</div>
          <Footer site={site} className="mt-auto" />
        </div>
      </main>
    </div>
  )
}
