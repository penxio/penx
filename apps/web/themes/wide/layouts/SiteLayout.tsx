import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
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
      <main className="relative mx-auto flex w-full flex-1 gap-x-16 px-4 xl:px-0">
        <Sidebar site={site} tags={tags} />
        <div className="flex flex-1 flex-col">
          <div className="mx-auto mt-0 w-full max-w-2xl flex-1 sm:pt-16">
            {children}
          </div>
          <Footer site={site} className="mt-auto" />
        </div>
      </main>
    </div>
  )
}
