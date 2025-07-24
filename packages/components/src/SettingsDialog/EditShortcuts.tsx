'use client'

import { Trans } from '@lingui/react/macro'
import { ShortcutType } from '@penx/model-type'
import { BindHotkey } from '../BindHotkey'

interface Props {}

export function EditShortcuts({}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center justify-between gap-3">
        <div>
          <BindHotkey type={ShortcutType.TOGGLE_PANEL_WINDOW} />
        </div>
        <div className="text-foreground">
          <Trans>Open Search Panel</Trans>
        </div>
      </div>
    </div>
  )
}
