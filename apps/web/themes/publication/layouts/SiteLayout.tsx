import { ReactNode } from 'react'
import { Footer } from '@penx/components/Footer'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  site: any
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <SectionContainer>
      <Header site={site} />
      <main className="mx-auto mb-auto flex w-full flex-col px-4 md:px-6 lg:max-w-6xl xl:px-0">
        {children}
      </main>
      <Footer site={site} />
    </SectionContainer>
  )
}
