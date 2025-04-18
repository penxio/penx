'use client'

import { useState } from 'react'
import { useQueryLogoImages } from '@/hooks/useLogoImages'
import { trpc } from '@/lib/trpc'
import { SpaceOnEvent } from '@/lib/types'

interface Props {
  spaces: SpaceOnEvent[]
}
export function SpaceInfoLoader({ spaces }: Props) {
  useQueryLogoImages(spaces)
  return null
}
