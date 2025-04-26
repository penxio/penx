'use client'

import { isServer } from '@penx/constants'

export function getSpaceId() {
  if (isServer) return ''
  const site = window.__SITE__
  return site?.spaceId as string
}
