'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { STATIC_URL } from '@/lib/constants'
import { CreationType } from '@/lib/theme.types'
import { Area, Channel, Mold, Site, Tag } from '@penx/db/client'

type SiteType = Site & {
  channels: Channel[]
  molds: Mold[]
  areas: Area[]
  tags: Tag[]
}

interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}

export const SiteContext = createContext({} as SiteType)

interface Props {
  site: SiteType
}

export const SiteProvider = ({ site, children }: PropsWithChildren<Props>) => {
  useEffect(() => {
    window.__SITE__ = site
  }, [site])

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSiteContext() {
  const site = useContext(SiteContext)
  function formatLogo() {
    if (!site.logo) return ''
    if (site.logo.startsWith('/')) {
      return `${STATIC_URL}${site.logo}`
    }
    return site.logo
  }

  const sortKeys = [
    CreationType.PAGE,
    CreationType.NOTE,
    CreationType.TASK,
    CreationType.ARTICLE,
    CreationType.AUDIO,
    CreationType.IMAGE,
    CreationType.BOOKMARK,
    CreationType.FRIEND,
    CreationType.PROJECT,
  ]

  return {
    ...site,
    molds: site.molds.sort((a, b) => {
      const indexA = sortKeys.indexOf(a.type as any)
      const indexB = sortKeys.indexOf(b.type as any)
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return 0
    }),
    logo: formatLogo(),
  }
}
