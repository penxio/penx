'use client'

import { Trans } from '@lingui/react/macro'
import { ShortcutType } from '@penx/types'
import { BindHotkey } from '../BindHotkey'

interface Props {}

export function EditShortcuts({}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-foreground">
          <Trans>Open Editor</Trans>
        </div>
        <div>
          <BindHotkey type={ShortcutType.TOGGLE_MAIN_WINDOW} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-foreground">
          <Trans>Open Search Panel</Trans>
        </div>
        <div>
          <BindHotkey type={ShortcutType.TOGGLE_PANEL_WINDOW} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-foreground">
          <Trans>Open Quick Input</Trans>
        </div>
        <div>
          <BindHotkey type={ShortcutType.TOGGLE_INPUT_WINDOW} />
        </div>
      </div>
    </div>
  )
}
