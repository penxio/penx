'use client'

import { Button } from '@penx/uikit/button'
import { closePanel, usePanels } from '@penx/hooks/usePanels'
import { Panel } from '@penx/types'
import { XIcon } from 'lucide-react'

export function ClosePanelButton({ panel }: { panel: Panel }) {
  const { panels } = usePanels()

  if (panels.length <= 1) return null
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-6 rounded-md p-1 "
      onClick={() => closePanel(panel.id)}
    >
      <XIcon size={14} />
    </Button>
  )
}
