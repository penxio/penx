'use client'

import { Trans } from '@lingui/react/macro'
import { useAuthStatus } from '@penx/hooks/useAuthStatus'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { LoginDialogContent } from './LoginDialogContent'
import { PinCodeForm } from './PinCodeForm'
import { RegisterForm } from './RegisterForm'
import { useLoginDialog } from './useLoginDialog'

interface Props {}

export function LoginDialog({}: Props) {
  const { isOpen, setIsOpen } = useLoginDialog()
  const { authStatus } = useAuthStatus()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        {authStatus.type === 'login' && (
          <>
            <DialogHeader>
              <DialogTitle className="mb-4 text-center text-2xl">
                <Trans>Welcome to PenX</Trans>
              </DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <LoginDialogContent />
          </>
        )}

        {authStatus.type === 'register' && (
          <div className="h-[290px]">
            <DialogHeader>
              <DialogTitle className="mb-6 text-center text-2xl">
                <Trans>Register to PenX</Trans>
              </DialogTitle>
            </DialogHeader>
            <RegisterForm />
          </div>
        )}

        {authStatus.type === 'register-email-sent' && (
          <div className="flex h-full flex-col">
            <DialogHeader>
              <DialogTitle className="">
                <Trans>Register to PenX</Trans>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <PinCodeForm></PinCodeForm>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
