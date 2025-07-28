'use client'

import { Trans } from '@lingui/react/macro'
import { ShortcutType } from '@penx/model-type'
import { BindHotkey, useShortcuts } from '../BindHotkey'

interface Props {}

export function EditShortcuts({}: Props) {
  const { refetch, data = [], isLoading } = useShortcuts()

  if (isLoading) return null
  const shortcut = data.find((i) => i.type === ShortcutType.TOGGLE_PANEL_WINDOW)
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center justify-between gap-3">
        <div>
          <BindHotkey
            type={ShortcutType.TOGGLE_PANEL_WINDOW}
            shortcut={shortcut}
          />
        </div>
        <div className="text-foreground">
          <Trans>Open Search Panel</Trans>
        </div>
      </div>
    </div>
  )
}
