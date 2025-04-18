'use client'

import { isServer } from './constants'

export function getSpaceId() {
  if (isServer) return ''
  const site = (window as any).__SITE__
  return site?.spaceId as string
}
