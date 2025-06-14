import React from 'react'
import { LoginContent } from '@/components/Login/LoginContent'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'

export function PageLogin() {
  return (
    <MobileContent
      title={
        <div className="text-foreground">
          <Trans>Login</Trans>
        </div>
      }
    >
      <LoginContent />
    </MobileContent>
  )
}
