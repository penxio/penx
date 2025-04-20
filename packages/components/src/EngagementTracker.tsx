'use client'

import { usePostEngagement } from '@penx/hooks/usePostEngagement'

export function EngagementTracker({ creationId }: { creationId: string }) {
  usePostEngagement({
    creationId,
  })

  return null
}
