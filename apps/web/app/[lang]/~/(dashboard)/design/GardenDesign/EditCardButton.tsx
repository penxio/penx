'use client'

import { PenIcon } from 'lucide-react'
import { GardenCardType } from '@penx/constants'
import { LayoutItem } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { useGardenSettingsDialog } from './GardenSettingsDialog/useGardenSettingsDialog'
import { getDisableDragProps } from './lib/getDisableDragProps'

export function EditCardButton({ item }: { item: LayoutItem }) {
  const { setState } = useGardenSettingsDialog()

  if (item.type === GardenCardType.TITLE) return
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute -right-2 -top-2 z-50 hidden size-8 border-none shadow group-hover:flex"
      onClick={() => {
        setState({ isOpen: true, layoutItem: item })
      }}
      {...getDisableDragProps()}
    >
      <PenIcon size={16} />
    </Button>
  )
}
