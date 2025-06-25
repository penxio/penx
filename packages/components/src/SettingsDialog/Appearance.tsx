'use client'

import { Trans } from '@lingui/react/macro'
import { LangSwitcher } from '../LangSwitcher'
import { ModeToggle } from '../ModeToggle'
import { useSettingsDialog } from './useSettingsDialog'

export function Appearance() {
  const { navName } = useSettingsDialog()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="">
          <Trans>Theme</Trans>
        </div>
        <ModeToggle />
      </div>
      <div className="flex items-center justify-between">
        <div className="">
          <Trans>Language</Trans>
        </div>
        <LangSwitcher />
      </div>
    </div>
  )
}
