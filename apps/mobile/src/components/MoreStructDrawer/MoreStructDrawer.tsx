'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { CheckIcon } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { Drawer } from '../Drawer'
import { PublishedStructList } from './PublishedStructList'
import { StructList } from './StructList'
import { useMoreStructDrawer } from './useMoreStructDrawer'

interface Props {}

export function MoreStructDrawer({}: Props) {
  const { isOpen, setIsOpen } = useMoreStructDrawer()

  return (
    <Drawer
      open={isOpen}
      setOpen={setIsOpen}
      className="select-none bg-neutral-100 dark:bg-neutral-800"
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-foreground flex items-center justify-between gap-2 text-lg">
          <span>
            <Trans>My structs</Trans>
          </span>
          <Button variant="default" size="xs" className="rounded-full">
            Install more
          </Button>
        </div>

        <StructList />
      </div>
    </Drawer>
  )
}
