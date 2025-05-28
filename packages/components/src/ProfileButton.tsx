'use client'

import { ReactNode } from 'react'
import { Trans } from '@lingui/react/macro'
import { openUrl } from '@tauri-apps/plugin-opener'
import ky from 'ky'
import {
  BadgeCheck,
  Bell,
  LogOut,
  MessageCircleIcon,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import {
  isDesktop,
  isExtension,
  isMobileApp,
  isWeb,
  LoginStatus,
  ROOT_HOST,
} from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useMySite } from '@penx/hooks/useMySite'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { useIsMobile } from '@penx/uikit/use-mobile'
import { cn, getUrl, sleep } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { usePlanListDialog } from './PlanList/usePlanListDialog'

interface Props {
  loginButton?: ReactNode
}

export function ProfileButton({ loginButton }: Props) {
  const { login } = useSession()
  // const { data: sites = [], error } = useMySites()
  const { session, data, logout, update } = useSession()
  const isMobile = useIsMobile()
  const { setIsOpen } = usePlanListDialog()
  const loginDialog = useLoginDialog()

  async function desktopLogin() {
    const authToken = nanoid()
    openUrl(`${ROOT_HOST}/desktop-login?token=${authToken}`)
    while (true) {
      try {
        const { status } = await ky
          .get(`${ROOT_HOST}/api/app/get-desktop-login-status`, {
            searchParams: { token: authToken },
          })
          .json<{ status: string }>()

        // console.log('=======status:', status)
        if (status === LoginStatus.CONFIRMED) {
          break
        }
        if (status === LoginStatus.CANCELED) {
          return
          // break
        }
        await sleep(1000)
      } catch (error) {
        console.log('error:', error)
        toast.error('please try again')
        return
      }
    }

    const session = await login({
      type: 'desktop-login',
      authToken,
    })
    appEmitter.emit('DESKTOP_LOGIN_SUCCESS', session)
  }

  async function handleLogin() {
    if (isDesktop) {
      await desktopLogin()
      console.log('Login with Google', 'isDesktop:', isDesktop)
      return
    }

    loginDialog.setIsOpen(true)
  }

  // async function selectSite(site: MySite) {
  //   updateSiteState(site)

  //   // window.__SITE_ID__ = site.id
  //   update({
  //     type: 'update-props',
  //     activeSiteId: site.id,
  //   })

  //   await store.panels.resetPanels()
  // }

  if (!session) {
    if (loginButton) return loginButton
    return (
      <Button size="sm" onClick={handleLogin}>
        <Trans>Log in</Trans>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-7 w-7 cursor-pointer rounded-lg">
          <AvatarImage src={getUrl(session.image || '')} alt={session?.name} />
          <AvatarFallback
            className={cn(
              'rounded-lg text-white',
              generateGradient(session.name),
            )}
          >
            {session?.name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
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
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.name}</span>
              <span className="truncate text-xs">{session?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}

        {/* <DropdownMenuGroup>
          <DropdownMenuLabel>Sites</DropdownMenuLabel>
          {sites.map((site) => (
            <DropdownMenuItem
              key={site.id}
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                selectSite(site as any)
              }}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={getUrl(site.logo!)} alt="" />
                <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>{site.name}</div>
              <div className="ml-auto">
                {session?.activeSiteId === site.id && <CheckIcon />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup> */}
        {!isMobileApp && <DropdownMenuSeparator />}

        {!isMobileApp && (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={async () => {
                if (isExtension) {
                  window.open(`${ROOT_HOST}/~/settings`)
                  return
                }
                if (isDesktop) {
                  console.log('is desktop....')
                  return
                }
                appEmitter.emit('ROUTE_TO_SETTINGS')
              }}
            >
              <BadgeCheck />
              <Trans>Settings</Trans>
            </DropdownMenuItem>

            {/* <DropdownMenuItem>
                <CreditCard />
                <Trans>Billing</Trans>
              </DropdownMenuItem> */}

            <DropdownMenuItem
              onClick={async () => {
                const path = `${ROOT_HOST}/~/settings/subscription`
                if (isExtension) {
                  window.open(path)
                  return
                }
                location.href = path
              }}
            >
              <Sparkles />
              <Trans>Upgrade to Pro</Trans>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                window.open('https://discord.gg/nyVpH9njDu')
              }}
            >
              <MessageCircleIcon />
              <Trans>Support</Trans>
            </DropdownMenuItem>

            {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await logout()
              appEmitter.emit('ON_LOGOUT_SUCCESS')
            } catch (error) {}
          }}
        >
          <LogOut />
          <Trans>Log out</Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
