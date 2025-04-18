import { ReactNode } from 'react'
import { Footer } from '@/components/theme-ui/Footer'
import { Site } from '@/lib/theme.types'
import { Header } from '../components/Header'
import SectionContainer from '../components/SectionContainer'

interface Props {
  site: Site
  children: ReactNode
}

export function SiteLayout({ children, site }: Props) {
  return (
    <SectionContainer className="px-0 py-0 md:py-[80px]">
      <div className="md:w-3xl bg-background md:max-h-[calc(100vh - 160px)] mx-auto flex min-h-screen w-full flex-col rounded p-4 sm:px-10 md:shadow">
        <Header site={site} className="text-center" />
        <main className="mb-auto flex-1">{children}</main>
        <Footer site={site} className="mt-auto" />
      </div>
    </SectionContainer>
  )
}
