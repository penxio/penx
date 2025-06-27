'use client'

import { XIcon } from 'lucide-react'
import { usePanels } from '@penx/hooks/usePanels'
import { store } from '@penx/store'
import { Panel } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

export function ClosePanelButton({
  panel,
  className,
}: {
  panel: Panel
  className?: string
}) {
  const { panels } = usePanels()

  // if (panels.length <= 1) return null
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('size-6 rounded-md p-1', className)}
      onClick={() => store.panels.closePanel(panel.id)}
    >
      <XIcon size={14} />
    </Button>
  )
}
