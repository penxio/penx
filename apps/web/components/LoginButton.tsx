'use client'

import { Trans } from '@lingui/react/macro'
import { CircleIcon, UserCircle, UserCircle2 } from 'lucide-react'
import { useAuthStatus } from './LoginDialog/useAuthStatus'
import { useLoginDialog } from './LoginDialog/useLoginDialog'
import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {
  appearance?: 'button' | 'icon'
}
export function LoginButton({ appearance = 'button', ...rest }: Props) {
  const { setIsOpen } = useLoginDialog()
  const { setAuthStatus } = useAuthStatus()
  return (
    <Button
      size={appearance === 'button' ? 'sm' : 'icon'}
      variant={appearance === 'button' ? 'default' : 'ghost'}
      {...rest}
      onClick={() => {
        setIsOpen(true)
        setAuthStatus('login')
      }}
    >
      {appearance === 'icon' ? (
        <UserCircle size={24} className="text-foreground/80" />
      ) : (
        <Trans>Sign in</Trans>
      )}
    </Button>
  )
}
