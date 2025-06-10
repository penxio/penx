'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { CheckIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { StructList } from './StructList'
import { useMoreStructDrawer } from './useMoreStructDrawer'

interface Props {}

export function MoreStructDrawer({}: Props) {
  const { isOpen, setIsOpen } = useMoreStructDrawer()

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} className="">
      <DrawerHeader>
        <DrawerTitle>
          <Trans>My structs</Trans>
        </DrawerTitle>
      </DrawerHeader>
      {/* <Button
            variant="default"
            size="xs"
            className="rounded-full"
            onClick={() => {
              appEmitter.emit('ROUTE_TO_STRUCT_INFO')
              setIsOpen(false)
            }}
          >
            <Trans>Create</Trans>
          </Button> */}

      <StructList />
    </Drawer>
  )
}
