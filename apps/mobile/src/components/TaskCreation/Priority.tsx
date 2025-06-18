import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon, FlagIcon } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { getTextColorByName } from '@penx/libs/color-helper'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useTheme } from '../theme-provider'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  struct: Struct
  creation: Creation
  onClick?: () => void
}
export function Priority({ children, struct, creation, className }: ItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const column = struct.columns.find((c) => c.slug === 'priority')!
  const value = creation.cells[column?.id!]
  const option = column.options.find((o) => o.id === value)

  return (
    <>
      <FlagIcon
        className={cn(option?.color && getTextColorByName(option?.color))}
        size={20}
        onClick={() => setIsOpen(true)}
      />

      <Drawer open={isOpen} setOpen={setIsOpen}>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Priority</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Menu>
          {column.options.map((o) => (
            <MenuItem
              key={o.id}
              checked={value === o.id}
              onClick={async () => {
                await updateCreationProps(creation.id, {
                  cells: {
                    ...creation.cells,
                    [column.id]: o.id,
                  },
                })
                setIsOpen(false)
              }}
            >
              <div className="flex items-center gap-2">
                <FlagIcon
                  className={cn(getTextColorByName(o.color))}
                  size={20}
                  onClick={() => setIsOpen(true)}
                />

                <span>{o.name}</span>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </Drawer>
    </>
  )
}
