'use client'

import { useEffect } from 'react'
import { Trans } from '@lingui/react/macro'

interface Props {}

export function About({}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <div className="-mt-10 flex flex-col items-center justify-center gap-2">
        <img
          src="https://penx.io/images/logo.svg"
          alt="logo"
          className="shadow-popover size-16 rounded-xl"
        />
        <div>
          <Trans>A structured note-taking App</Trans>
        </div>
        {window.customElectronApi?.getAppInfo?.version && (
          <div className="text-foreground/50 text-sm">
            v{window.customElectronApi?.getAppInfo?.version}
          </div>
        )}
      </div>
    </div>
  )
}
