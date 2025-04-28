'use client'

import { Trans } from '@lingui/react'
import { CircleIcon, UserCircle, UserCircle2 } from 'lucide-react'
import { Button, ButtonProps } from '@penx/uikit/button'
import { useAuthStatus } from '@penx/widgets/useAuthStatus'
import { useLoginDialog } from '@penx/widgets/useLoginDialog'

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
        <Trans id="Sign in"></Trans>
      )}
    </Button>
  )
}
