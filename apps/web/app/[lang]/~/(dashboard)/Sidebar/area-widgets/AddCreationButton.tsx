'use client'

import React from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { useAddCreation } from '@/hooks/useAddCreation'
import { Widget } from '@/lib/types'
import { Area } from '@penx/db/client'
import { PlusIcon } from 'lucide-react'

interface Props {
  area: Area
  widget: Widget
}

export function AddCreationButton({ area, widget }: Props) {
  const { molds } = useSiteContext()
  const addCreation = useAddCreation()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="inline-flex size-6 items-center justify-center rounded-md p-0"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={async (e) => {
        e.stopPropagation()
        e.preventDefault()
        const mold = molds.find((mold) => mold.id === widget.moldId)!
        addCreation(mold.type)
      }}
    >
      <PlusIcon className="text-muted-foreground pointer-events-none size-4 transition-transform duration-200" />
    </Button>
  )
}
