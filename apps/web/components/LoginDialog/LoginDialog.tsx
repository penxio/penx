'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/ui/components/dialog'
import { Trans } from '@lingui/react/macro'
import { LoginDialogContent } from './LoginDialogContent'
import { RegisterForm } from './RegisterForm'
import { useAuthStatus } from './useAuthStatus'
import { useLoginDialog } from './useLoginDialog'

interface Props {}

export function LoginDialog({}: Props) {
  const { isOpen, setIsOpen } = useLoginDialog()
  const { authStatus } = useAuthStatus()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        {authStatus === 'login' && (
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

        {authStatus === 'register' && (
          <div className="h-[290px]">
            <DialogHeader>
              <DialogTitle className="mb-6 text-center text-2xl">
                <Trans>Register to PenX</Trans>
              </DialogTitle>
            </DialogHeader>
            <RegisterForm />
          </div>
        )}

        {authStatus === 'register-email-sent' && (
          <div className="flex h-[290px] flex-col">
            <DialogHeader>
              <DialogTitle className=""></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="item-center flex flex-1 flex-col justify-center gap-4 text-center">
              <h1 className="text-2xl font-semibold">
                <Trans>Email validate Link sent</Trans>
              </h1>
              <p className="text-green-500">
                <Trans>
                  Please check your email for the verification link.
                </Trans>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
