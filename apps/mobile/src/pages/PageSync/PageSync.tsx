import React from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { SyncContent } from './SyncContent'

export function PageSync() {
  return (
    <MobileContent title={<Trans>Sync</Trans>}>
      <SyncContent />
    </MobileContent>
  )
}
