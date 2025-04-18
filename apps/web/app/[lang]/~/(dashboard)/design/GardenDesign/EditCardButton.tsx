'use client'

import { Button } from '@/components/ui/button'
import { GardenCardType } from '@/lib/constants'
import { LayoutItem } from '@/lib/theme.types'
import { PenIcon } from 'lucide-react'
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
