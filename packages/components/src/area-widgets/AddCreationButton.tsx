'use client'

import React from 'react'
import { PlusIcon } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { Area } from '@penx/domain'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useMolds } from '@penx/hooks/useMolds'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

interface Props {
  area: Area
  widget: Widget
}

export function AddCreationButton({ area, widget }: Props) {
  const { molds } = useMolds()
  const addCreation = useAddCreation()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'inline-flex size-6 items-center justify-center rounded-md p-0',
        isMobileApp && 'size-8',
      )}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={async (e) => {
        e.stopPropagation()
        e.preventDefault()
        const mold = molds.find((mold) => mold.id === widget.moldId)!
        addCreation(mold.type)
      }}
    >
      <PlusIcon
        className={cn(
          'text-muted-foreground pointer-events-none size-4 transition-transform duration-200',
          isMobileApp && 'size-5',
        )}
      />
    </Button>
  )
}
