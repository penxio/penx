import { useState } from 'react'
import { impact } from '@/lib/impact'
import { darken, transparentize } from '@fower/color-helper'
import { produce } from 'immer'
import { ChevronRightIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { colorNameMaps, getBgColor } from '@penx/libs/color-helper'
import { IColumn } from '@penx/model-type'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'
import { OptionTag } from './OptionTag'

interface Props {
  struct: Struct
  column: IColumn
  value: string[]
  onChange: (ids: string[]) => void
}
export const MultipleSelectProp = ({
  column,
  struct,
  value = [],
  isPanel,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false)
  const options = column.options || []

  return (
    <>
      <div
        className="flex h-full w-full items-center justify-end pl-3 pr-1"
        onClick={async () => {
          impact()
          setOpen(true)
        }}
      >
        <div className="flex h-full flex-1 items-center justify-end gap-1">
          {options.map((o) => {
            if (!value.includes(o.id)) return null
            return (
              <div
                key={o.id}
                className={cn(
                  'rounded-full px-2 py-0.5 text-sm text-white',
                  // getBgColor(o.color),
                )}
                style={{
                  color: darken(colorNameMaps[o.color], 10),
                  background: transparentize(colorNameMaps[o.color], 80),
                }}
              >
                {o.name}
              </div>
            )
          })}
        </div>
        <ChevronRightIcon className="text-foreground/50 size-5" />
      </div>

      <Drawer open={open} setOpen={setOpen} className="">
        <DrawerHeader>
          <DrawerTitle>{column.name}</DrawerTitle>
        </DrawerHeader>

        {!options.length && (
          <div className="py-4 text-center">No options available.</div>
        )}
        <Menu>
          {options.map((item) => (
            <MenuItem
              // className="flex h-12 items-center justify-between px-3"
              key={item.id}
              checked={value.includes(item.id)}
              onClick={async () => {
                impact()
                const newIds = produce(value || [], (draft) => {
                  if (draft.includes(item.id)) {
                    draft.splice(draft.indexOf(item.id), 1)
                  } else {
                    draft.push(item.id)
                  }
                })
                onChange(newIds)
                setOpen(false)
              }}
            >
              <OptionTag
                option={{
                  id: item.id,
                  name: item?.name,
                  color: item?.color,
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Drawer>
    </>
  )
}
