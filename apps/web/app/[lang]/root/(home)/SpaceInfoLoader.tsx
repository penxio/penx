'use client'

import { useState } from 'react'
import { useQueryLogoImages } from '@/hooks/useLogoImages'
import { trpc } from '@penx/trpc-client'
import { SpaceOnEvent } from '@/lib/types'

interface Props {
  spaces: SpaceOnEvent[]
}
export function SpaceInfoLoader({ spaces }: Props) {
  useQueryLogoImages(spaces)
  return null
}
