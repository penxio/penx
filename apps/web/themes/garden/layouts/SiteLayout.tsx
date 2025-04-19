import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { GridLayoutContainer } from '@/components/theme-ui/grid-ui'
import { Site, Tag } from '@penx/types'
import { cn } from '@penx/utils'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  isHome: boolean
  site: Site
  tags: Tag[]
  children: ReactNode
}

export function SiteLayout({ children, site, tags, isHome }: Props) {
  return (
    <SectionContainer>
      <Header site={site} />
      <GridLayoutContainer
        site={site}
        className="mx-auto mb-auto px-4 pt-0 sm:pt-20"
        style={
          {
            '--header-height': '60px',
          } as any
        }
      >
        {children}
      </GridLayoutContainer>
      <Footer site={site} />
    </SectionContainer>
  )
}
