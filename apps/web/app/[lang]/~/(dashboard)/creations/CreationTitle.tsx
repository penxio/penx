'use client'

import { CreationType } from '@penx/types'
import { Trans } from '@lingui/react'
import { useSearchParams } from 'next/navigation'

export function CreationTitle() {
  const searchParams = useSearchParams()
  const type = searchParams?.get?.('type')
  if (type === CreationType.ARTICLE) return <Trans id="Articles"></Trans>
  if (type === CreationType.NOTE) return <Trans id="Notes"></Trans>
  if (type === CreationType.IMAGE) return <Trans id="Images"></Trans>
  if (type === CreationType.AUDIO) return <Trans id="Podcasts"></Trans>
  if (type === CreationType.FRIEND) return <Trans id="Friends"></Trans>
  if (type === CreationType.PROJECT) return <Trans id="Projects"></Trans>
  return <div>{type}</div>
}
