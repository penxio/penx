import { SiteInSession } from './types'

interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}

export function getDashboardPath(site: any) {
  if (!site) return '/~/creations?type=ARTICLE'
  const { features } = (site.config || {}) as any as {
    features: Features
  }

  if (features?.journal) {
    return '/~/page?id=today'
  } else {
    return '/~/creations?type=ARTICLE'
  }
}
