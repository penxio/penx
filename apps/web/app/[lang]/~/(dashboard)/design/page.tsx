'use client'

import { useEffect } from 'react'
import { SiteProvider, useSiteContext } from '@penx/contexts/SiteContext'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { Design } from './Design'
import { useThemeName } from './hooks/useThemeName'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site } = useQuerySite()
  const { themeName, setThemeName } = useThemeName()

  useEffect(() => {
    if (!site) return
    setThemeName(site.themeName || 'garden')
  }, [site])

  if (!themeName || isLoading) return null

  return (
    <SiteProvider site={site as any}>
      <Design />
    </SiteProvider>
  )
}
