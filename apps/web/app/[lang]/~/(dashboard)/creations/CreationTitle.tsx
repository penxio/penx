'use client'

import { CreationType } from '@/lib/theme.types'
import { Trans } from '@lingui/react/macro'
import { useSearchParams } from 'next/navigation'

export function CreationTitle() {
  const searchParams = useSearchParams()
  const type = searchParams?.get?.('type')
  if (type === CreationType.ARTICLE) return <Trans>Articles</Trans>
  if (type === CreationType.NOTE) return <Trans>Notes</Trans>
  if (type === CreationType.IMAGE) return <Trans>Images</Trans>
  if (type === CreationType.AUDIO) return <Trans>Podcasts</Trans>
  if (type === CreationType.FRIEND) return <Trans>Friends</Trans>
  if (type === CreationType.PROJECT) return <Trans>Projects</Trans>
  return <div>{type}</div>
}
