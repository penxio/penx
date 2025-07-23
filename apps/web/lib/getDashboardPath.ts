interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}

export function getDashboardPath(space: any) {
  if (!space) return '/~/creations?type=ARTICLE'
  const { features } = (space.config || {}) as any as {
    features: Features
  }

  if (features?.journal) {
    return '/~/page?id=today'
  } else {
    return '/~/creations?type=ARTICLE'
  }
}
