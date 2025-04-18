'use client'

import { usePostEngagement } from '@/hooks/usePostEngagement'

export function EngagementTracker({ creationId }: { creationId: string }) {
  usePostEngagement({
    creationId,
  })

  return null
}
