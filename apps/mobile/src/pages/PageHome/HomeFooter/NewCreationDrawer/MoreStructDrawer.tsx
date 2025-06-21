'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { CheckIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { Drawer } from '../../../../components/ui/Drawer'
import { DrawerHeader } from '../../../../components/ui/DrawerHeader'
import { DrawerTitle } from '../../../../components/ui/DrawerTitle'
import { StructList } from './StructList'
import { useMoreStructDrawer } from './useMoreStructDrawer'

interface Props {}

export function MoreStructDrawer({}: Props) {
  const { isOpen, setIsOpen } = useMoreStructDrawer()

  return (
    <Drawer open={isOpen} setOpen={setIsOpen} className="pb-0" isFullHeight>
      <DrawerHeader>
        <DrawerTitle>
          <Trans>My structs</Trans>
        </DrawerTitle>
      </DrawerHeader>

      <StructList />
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
    </Drawer>
  )
}
