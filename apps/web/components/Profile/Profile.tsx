'use client'

import { useSession } from '@/components/session'
import { useSite } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@penx/constants'
import { getDashboardPath } from '@/lib/getDashboardPath'
import { useRouter } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'
import { LoginButton } from '../LoginButton'
import { LoginDialog } from '../LoginDialog/LoginDialog'
import { useLoginDialog } from '../LoginDialog/useLoginDialog'
import { Avatar, AvatarFallback } from '@penx/uikit/ui/avatar'
import { Button, ButtonProps } from '@penx/uikit/ui/button'
import { ProfilePopover } from './ProfilePopover'

interface Props {
  showDashboard?: boolean
  buttonProps?: ButtonProps
  appearance?: 'button' | 'icon'
}

export function Profile({
  showDashboard = false,
  buttonProps,
  appearance = 'button',
}: Props) {
  const { data, status } = useSession()
  const { site } = useSite()
  const { push } = useRouter()

  if (status === 'loading')
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback></AvatarFallback>
      </Avatar>
    )

  const authenticated = !!data

  return (
    <>
      <LoginDialog />
      {!authenticated && (
        <LoginButton {...buttonProps} appearance={appearance} />
      )}
      {authenticated && (
        <div className="flex items-center gap-2">
          {showDashboard && (
            <Button
              size="sm"
              onClick={() => {
                if (location.host === ROOT_DOMAIN) {
                  const path = `/~/areas/${data.activeAreaId}`
                  push(path)
                  return
                }
                location.href = `${location.protocol}//${ROOT_DOMAIN}/~`
              }}
            >
              <Trans>Dashboard</Trans>
            </Button>
          )}
          <ProfilePopover />
        </div>
      )}
    </>
  )
}
