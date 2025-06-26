'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { Button } from '@penx/uikit/button'
import { IconGoogle } from '@penx/uikit/components/icons/IconGoogle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/dialog'
import { RecoverFromGoogleForm } from './RecoverFromGoogleForm'

export function RecoverFromGoogleDialog() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild>
        <Button className="flex h-[56px] w-[280px] justify-between gap-x-2">
          <IconGoogle className="size-6" />
          <div className="text-base font-semibold">
            <Trans>Restore from google drive</Trans>
          </div>
        </Button>
      </DialogTrigger>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <DialogContent
        // showOverlay={false}
        className="text-foreground sm:max-w-[400px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <div>
              <Trans>Google drive backup password</Trans>
            </div>
          </DialogTitle>
        </DialogHeader>
        <RecoverFromGoogleForm
          onSubmitSuccess={() => {
            setIsOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
