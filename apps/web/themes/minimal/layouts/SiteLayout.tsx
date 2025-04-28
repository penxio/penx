import { ReactNode } from 'react'
import { Footer } from '@penx/components/Footer'
import { Site } from '@penx/types'
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
      <main className="mb-auto">{children}</main>
      <Footer site={site} />
    </SectionContainer>
  )
}
