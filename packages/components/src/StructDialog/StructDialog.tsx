'use client'

import { Trans } from '@lingui/react/macro'
import { isMobileApp } from '@penx/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { cn } from '@penx/utils'
import { CreateStructForm } from './CreateStructForm'
import { EditStructForm } from './EditStructForm'
import { useStructDialog } from './useStructDialog'

export function StructDialog() {
  const { isOpen, setIsOpen, struct } = useStructDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        className={cn(
          'text-foreground sm:max-w-[520px]',
          isMobileApp && '-mt-32',
        )}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {!!struct ? (
              <Trans>Update struct</Trans>
            ) : (
              <Trans>Create struct</Trans>
            )}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        {!!struct ? <EditStructForm /> : <CreateStructForm />}
      </DialogContent>
    </Dialog>
  )
}
