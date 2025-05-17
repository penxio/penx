'use client'

import React from 'react'
import { PlusIcon } from 'lucide-react'
import { Area } from '@penx/db/client'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { PanelType, Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'

interface Props {
  widget: Widget
}

export function AddChatButton({ widget }: Props) {
  const { structs } = useStructs()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="inline-flex size-6 items-center justify-center rounded-md p-0"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={async (e) => {
        e.stopPropagation()
        e.preventDefault()

        store.panels.openWidgetPanel(widget)
      }}
    >
      <PlusIcon className="text-muted-foreground pointer-events-none size-4 transition-transform duration-200" />
    </Button>
  )
}
