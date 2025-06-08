'use client'

import { ReactNode, useState } from 'react'
import { isAndroid, isIOS } from 'react-device-detect'
import { Trans } from '@lingui/react/macro'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { WidgetList } from './WidgetList'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function EditWidgetButton({ className }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        size="xs"
        variant="secondary"
        className="bg-foreground/8 hover:bg-foreground/10"
        onClick={() => {
          setOpen(true)
        }}
      >
        <Trans>Edit widget</Trans>
      </Button>
      <Drawer open={open} setOpen={setOpen} isFullHeight>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Edit widgets</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <WidgetList />
      </Drawer>
    </>
  )
}
