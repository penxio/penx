'use client'

import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react'
import { Drawer } from 'vaul'
import { Button } from '@penx/uikit/button'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { cn } from '@penx/utils'
import { AddWidgetButton } from '../AddWidgetButton'
import { WidgetList } from './WidgetList'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function EditWidgetButton({ className }: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        size="xs"
        variant="secondary"
        className="bg-foreground/8 hover:bg-foreground/10"
        onClick={() => {
          setVisible(true)
        }}
      >
        <Trans id="Edit widget"></Trans>
      </Button>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] min-h-[90vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none">
            <div
              aria-hidden
              className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />

            <DialogTitle className="hidden">
              <DialogDescription />
            </DialogTitle>

            <div className="flex-1 space-y-3 overflow-auto px-4 pb-6">
              <WidgetList />
              <AddWidgetButton />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
