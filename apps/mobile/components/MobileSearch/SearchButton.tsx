'use client'

import React, { useRef, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Drawer } from 'vaul'
import { Button } from '@penx/uikit/button'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { SearchPanel } from './SearchPanel'

export function SearchButton() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="size-9 rounded-full"
        onClick={() => setVisible(true)}
      >
        <SearchIcon size={24} />
      </Button>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 flex max-h-[95vh] min-h-[95vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none">
            <div
              aria-hidden
              className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />

            <DialogTitle className="hidden">
              <DialogDescription />
            </DialogTitle>
            <SearchPanel setVisible={setVisible} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
