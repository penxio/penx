import { Dialog } from '@capacitor/dialog'
import {
  DefaultSystemBrowserOptions,
  InAppBrowser,
} from '@capacitor/inappbrowser'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon, UserIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useMobileNav } from '@penx/hooks/useMobileNav'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { AboutMenu } from './AboutMenu'
import { JournalLayoutMenu } from './JournalLayoutMenu'
import { LocaleMenu } from './LocaleMenu'
import { SubscriptionMenu } from './SubscriptionMenu'
import { ThemeMenu } from './ThemeMenu'
import { api } from '@penx/api'

export function Profile() {
  const { session, logout } = useSession()
  return (
    <div className="flex h-full flex-col">
      {!session && (
        <div
          className={cn(
            'text-foreground flex items-center justify-between py-2',
          )}
          onClick={() => {
            appEmitter.emit('ROUTE_TO_LOGIN')
          }}
        >
          <div className="flex items-center gap-1">
            <div className="bg-foreground/10 flex size-12 items-center justify-center rounded-full">
              <UserIcon size={24} />
            </div>
            <div className="font-medium">
              <Trans>Login or Register</Trans>
            </div>
          </div>
          <div>
            <ChevronRightIcon className="text-foreground/50" />
          </div>
        </div>
      )}
      {session && (
        <div className="text-foreground flex items-center gap-2">
          <Avatar className="size-12 rounded-lg">
            <AvatarImage src={getUrl(session?.image)} alt={session?.name} />
            <AvatarFallback
              className={cn(
                'rounded-lg text-white',
                generateGradient(session.name),
              )}
            >
              {session?.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-bold">{session?.name}</div>
            <div className="text-foreground/60">{session?.email}</div>
          </div>
        </div>
      )}
      <div className="text-foreground mt-10 flex flex-1 flex-col gap-1">
        {/* <SubscriptionMenu /> */}
        <LocaleMenu />
        <ThemeMenu />
        <JournalLayoutMenu />

        <AboutMenu />

        {session && (
          <Item
            onClick={async () => {
              const { value } = await Dialog.confirm({
                title: t`Delete Account`,
                message: t`All your data will be deleted. This action cannot be undone. Are you sure you want to delete your account?`,
              })

              if (value) {
                api.
                await logout()
                appEmitter.emit('ON_LOGOUT_SUCCESS')
              }
            }}
          >
            <Trans>Delete account</Trans>
          </Item>
        )}

        {session && (
          <Item
            onClick={async () => {
              const { value } = await Dialog.confirm({
                title: t`Log out`,
                message: t`Are you sure you want to log out?`,
              })

              if (value) {
                await logout()
                appEmitter.emit('ON_LOGOUT_SUCCESS')
              }
            }}
          >
            <Trans>Log out</Trans>
          </Item>
        )}
      </div>
      <div className="flex items-center justify-center">
        <span
          className="text-foreground/50 text-sm"
          onClick={async (e) => {
            e.preventDefault()
            await InAppBrowser.openInSystemBrowser({
              url: 'https://penx.io/privacy',
              options: DefaultSystemBrowserOptions,
            })
          }}
        >
          <Trans>Privacy Policy</Trans>
        </span>
      </div>
    </div>
  )
}

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
function Item({ children, className, onClick }: ItemProps) {
  return (
    <div
      className={cn(
        'border-foreground/5 flex items-center justify-between border-b py-2',
        className,
      )}
      onClick={() => onClick?.()}
    >
      <div className="font-medium">{children}</div>
      <div>
        <ChevronRightIcon className="text-foreground/50" />
      </div>
    </div>
  )
}
