import React from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Profile } from '@/components/Profile/Profile'
import { Trans } from '@lingui/react/macro'

export function PageProfile() {
  return (
    <MobileContent
      title={
        <div className="text-foreground">
          <Trans>Settings</Trans>
        </div>
      }
    >
      <Profile></Profile>
    </MobileContent>
  )
}
