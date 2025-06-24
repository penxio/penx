import React from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Profile } from '@/components/Profile/Profile'
import { mainBackgroundLight } from '@/lib/constants'
import { Trans } from '@lingui/react/macro'

export function PageProfile() {
  return (
    <MobileContent
      backgroundColor={mainBackgroundLight}
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
