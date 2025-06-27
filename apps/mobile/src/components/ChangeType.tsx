'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { Creation } from '@penx/domain'
import {
  updateCreationProps,
  updateCreationState,
} from '@penx/hooks/useCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { StructName } from '@penx/widgets/StructName'
import { Drawer } from './ui/Drawer'
import { DrawerHeader } from './ui/DrawerHeader'
import { DrawerTitle } from './ui/DrawerTitle'
import { Menu } from './ui/Menu'
import { MenuItem } from './ui/MenuItem'

export function ChangeType({ creation }: { creation: Creation }) {
  const { structs } = useStructs()
  const [open, setOpen] = useState(false)
  const struct = structs.find((m) => m.id === creation.structId)

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        className="text-foreground/60 -ml-2 h-7 gap-1 rounded-full px-2 text-xs"
        onClick={() => {
          setOpen(true)
        }}
      >
        <StructName struct={struct!} />
      </Button>

      <Drawer open={open} setOpen={setOpen}>
        <DrawerHeader showCancelButton>
          <DrawerTitle>
            <Trans>Change type</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <Menu>
          {structs.map((item) => {
            const checked = item.id === struct?.id
            return (
              <MenuItem
                key={item.id}
                className="flex gap-2"
                checked={checked}
                onClick={async () => {
                  setOpen(false)
                  updateCreationProps(creation.id, {
                    type: item.type,
                    structId: item.id,
                  })
                }}
              >
                {getCreationIcon(item.type)}
                <span>
                  <StructName struct={item!} />
                </span>
              </MenuItem>
            )
          })}
        </Menu>
      </Drawer>
    </>
  )
}
