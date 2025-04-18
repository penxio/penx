import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { GridLayoutContainer } from '@/components/theme-ui/grid-ui'
import { Site } from '@/lib/theme.types'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  site: Site
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <SectionContainer>
      <Header site={site} />
      <GridLayoutContainer
        site={site}
        className="mx-auto mb-auto w-full max-w-2xl px-4 pt-0 sm:pt-20"
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
