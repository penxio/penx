import { useState } from 'react'
import { PenLine, ShapesIcon } from 'lucide-react'
import { bgColorMaps } from '@penx/libs/color-helper'
import { Menu, MenuItem } from '@penx/uikit/menu'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { useDatabaseContext } from './DatabaseProvider'
import { StructForm } from './StructForm'

export const TableInfo = () => {
  const { struct } = useDatabaseContext()
  const [open, setOpen] = useState(false)

  if (!struct) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer items-center gap-1">
          <div className="flex items-center gap-1 text-base font-bold">
            <span
              className={cn(
                'text-background flex h-5 w-5 items-center justify-center rounded-full text-sm',
                bgColorMaps[struct.color] || 'bg-foreground/50',
              )}
            >
              <ShapesIcon size={12} />
            </span>
            <span>{struct.name || 'Untitled'}</span>
          </div>
          <PenLine size={14} />
        </div>
      </PopoverTrigger>
      <PopoverContent isPortal className="w-64 p-3">
        <StructForm setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  )
}
