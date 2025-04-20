import { Dispatch, SetStateAction, useState } from 'react'
import { Input } from '@penx/uikit/ui/input'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import { Separator } from '@penx/uikit/ui/separator'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { bgColorMaps, textColorMaps } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import { PenLine } from 'lucide-react'
import { toast } from 'sonner'
import { useDatabaseContext } from './DatabaseProvider'

function ColorSelector({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { updateDatabase, database } = useDatabaseContext()
  const colorEntries = Object.entries(bgColorMaps)

  async function selectColor(color: string) {
    updateDatabase({ color })
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4">
      {colorEntries.map(([color, bg]) => (
        <div
          key={color}
          className={cn(
            'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
            bg,
          )}
          title={color}
          onClick={() => selectColor(color)}
        />
      ))}
    </div>
  )
}

function Content({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { database, updateDatabase } = useDatabaseContext()
  const [name, setName] = useState(database.name || '')
  const { copy } = useCopyToClipboard()

  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 pt-3">
        <Input
          size="sm"
          value={name || ''}
          onBlur={() => {
            updateDatabase({ name })
            setOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateDatabase({ name })
              setOpen(false)
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>

      <ColorSelector setOpen={setOpen} />

      <Separator />

      <div className="p-1">
        <PopoverClose asChild>
          <MenuItem
            onClick={() => {
              copy(database.id)
              toast.success('Copied to clipboard')
            }}
          >
            Copy database ID
          </MenuItem>
        </PopoverClose>
      </div>
    </div>
  )
}

export const TableName = () => {
  const { database } = useDatabaseContext()
  const [open, setOpen] = useState(false)

  if (!database) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer items-center gap-1">
          <div className="flex items-center gap-1 text-base font-bold">
            <span
              className={cn(
                'text-background flex h-5 w-5 items-center justify-center rounded-full text-sm',
                bgColorMaps[database.color!] || 'bg-foreground/50',
              )}
            >
              #
            </span>
            <span>{database.name || 'Untitled'}</span>
          </div>
          <PenLine size={14} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Content setOpen={setOpen}></Content>
      </PopoverContent>
    </Popover>
  )
}
