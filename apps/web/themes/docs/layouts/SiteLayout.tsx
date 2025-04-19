import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Site } from '@penx/types'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'
import { Sidebar } from '../components/Sidebar'

interface Props {
  site: Site
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <div>
      <Header site={site} />
      <main className="relative mx-auto flex w-full max-w-7xl flex-1 gap-x-16 px-4 xl:px-0">
        <Sidebar site={site} className="hidden md:block" />
        <div className="flex-1">{children}</div>
        {/* <Footer site={site} /> */}
      </main>
    </div>
  )
}
