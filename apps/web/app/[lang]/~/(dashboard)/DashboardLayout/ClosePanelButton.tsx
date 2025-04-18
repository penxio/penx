'use client'

import { Button } from '@/components/ui/button'
import { closePanel, usePanels } from '@/hooks/usePanels'
import { Panel } from '@/lib/types'
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
