'use client'

import { useEffect } from 'react'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Design } from './Design'
import { useThemeName } from './hooks/useThemeName'

// export const runtime = 'edge'
// export const dynamic = 'force-static'

export default function Page() {
  const site = useSiteContext()
  const { themeName, setThemeName } = useThemeName()

  useEffect(() => {
    setThemeName(site.themeName || 'sue')
  }, [])

  if (!themeName) return null

  return <Design />
}
