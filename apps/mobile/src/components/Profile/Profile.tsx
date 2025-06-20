import { useMemo } from 'react'
import { impact } from '@/lib/impact'
import { Dialog } from '@capacitor/dialog'
import {
  DefaultSystemBrowserOptions,
  DefaultWebViewOptions,
  InAppBrowser,
} from '@capacitor/inappbrowser'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon, CopyIcon, UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { useMobileNav } from '@penx/hooks/useMobileNav'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { PlanType } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Badge } from '@penx/uikit/ui/badge'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { Card } from '../ui/Card'
import { AboutMenu } from './AboutMenu'
import { GuideEntryMenu } from './GuideEntryMenu'
import { JournalLayoutMenu } from './JournalLayoutMenu'
import { LocaleMenu } from './LocaleMenu'
import { SubscriptionMenu } from './SubscriptionMenu'
import { ThemeMenu } from './ThemeMenu'

export function Profile() {
  const { session, logout } = useSession()

  const planType = useMemo(() => {
    if (!session) return ''
    if (session.planType === PlanType.STANDARD) return <Trans>PRO</Trans>
    if (session.planType === PlanType.PRO) return <Trans>PRO + AI</Trans>
    if (session.planType === PlanType.BELIEVER) return <Trans>Believer</Trans>
    return <Trans>Free</Trans>
  }, [session])

  const { copy } = useCopyToClipboard()

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
        <div className="flex flex-col gap-2">
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
          <div className="flex gap-2 text-lg">
            <Badge
              className="flex items-center gap-1 px-3"
              variant="secondary"
              onClick={() => {
                impact()
                copy(session.pid)
                toast.success(t`Copied to clipboard`)
              }}
            >
              PenX ID:{' '}
              <span className="text-base font-bold">{session.pid}</span>{' '}
              <CopyIcon size={16} />
            </Badge>
            <Badge variant="secondary">{planType}</Badge>
          </div>
        </div>
      )}
      {/* <Card>PenX PRO</Card> */}
      <div className="text-foreground mt-10 flex flex-1 flex-col gap-1">
        <GuideEntryMenu />
        <SubscriptionMenu />
        <LocaleMenu />
        <ThemeMenu />
        <JournalLayoutMenu />

        <AboutMenu />

        {session && (
          <Item
            className="text-red-500"
            onClick={async () => {
              const { value } = await Dialog.confirm({
                title: t`Delete account`,
                message: t`All your data will be deleted. This action cannot be undone. Are you sure you want to delete your account?`,
              })

              if (value) {
                toast.promise(
                  async () => {
                    await api.deleteAccount()
                    await localDB.deleteAllSiteData(session.siteId)
                    await logout()
                    appEmitter.emit('ON_LOGOUT_SUCCESS')
                    appEmitter.emit('DELETE_ACCOUNT')
                  },
                  {
                    loading: t`Account deletion in progress...`,
                    success: t`Account deleted successfully!`,
                    error: () => {
                      return t`Failed to delete account. Please try again.`
                    },
                  },
                )
              }
            }}
          >
            <Trans>Delete account</Trans>
          </Item>
        )}

        {session && (
          <Item
            className="text-red-500"
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

            await InAppBrowser.openInWebView({
              url: 'https://penx.io/privacy',
              options: DefaultWebViewOptions,
            })
            // await InAppBrowser.openInSystemBrowser({
            //   url: 'https://penx.io/privacy',
            //   options: DefaultSystemBrowserOptions,
            // })
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
