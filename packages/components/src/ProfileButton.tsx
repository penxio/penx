'use client'

import { ReactNode, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
// import { fetch } from '@tauri-apps/plugin-http'
import { openUrl } from '@tauri-apps/plugin-opener'
import ky from 'ky'
import {
  BadgeCheck,
  Bell,
  CogIcon,
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
import { useMySpace } from '@penx/hooks/useMySpace'
import { updateSession, useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button, ButtonProps } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import { Separator } from '@penx/uikit/ui/separator'
import { useIsMobile } from '@penx/uikit/use-mobile'
import { cn, getUrl, sleep } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { usePlanListDialog } from './PlanList/usePlanListDialog'
import { useSettingsDialog } from './SettingsDialog/useSettingsDialog'

interface Props extends ButtonProps {
  loginButton?: ReactNode
  onOpenSettings?: () => void
}

export function ProfileButton({ loginButton, onOpenSettings, ...rest }: Props) {
  const { login } = useSession()
  const { session, data, logout, update } = useSession()
  const isMobile = useIsMobile()
  const { setIsOpen } = usePlanListDialog()
  const loginDialog = useLoginDialog()
  const settings = useSettingsDialog()
  const [loading, setLoading] = useState(false)

  async function desktopLogin() {
    const authToken = nanoid()
    const url = `${ROOT_HOST}/desktop-login?token=${authToken}`
    // openUrl()
    window.electron.ipcRenderer.send('open-url', url)

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 30 * 1000)
    while (true) {
      try {
        // const { status } = await ky
        //   .get(`${ROOT_HOST}/api/get-desktop-login-status`, {
        //     searchParams: { token: authToken },
        //   })
        //   .json<{ status: string }>()

        const { status } = await fetch(
          `${ROOT_HOST}/api/get-desktop-login-status?token=${authToken}`,
        ).then((r) => r.json())

        // console.log('=======status:', status)
        if (status === LoginStatus.CONFIRMED) {
          break
        }
        if (status === LoginStatus.CANCELED) {
          setLoading(false)
          return
          // break
        }
        await sleep(300)
      } catch (error) {
        console.log('error:', error)
        toast.error('please try again')
        return
      }
    }

    try {
      const session = await login({
        type: 'desktop-login',
        authToken,
      })
      console.log('desktop ====session:', session)
      updateSession(session)

      appEmitter.emit('DESKTOP_LOGIN_SUCCESS', session)

      fetch('http://localhost:14158/open-window')
    } catch (error) {
      toast.error(t`Log in failed`)
    }
    setLoading(false)
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
  //     activeSpaceId: site.id,
  //   })

  //   await store.panels.resetPanels()
  // }

  if (!session) {
    if (loginButton) return loginButton
    return (
      <Button size="sm" disabled={loading} onClick={handleLogin} {...rest}>
        <Trans>Log in</Trans>
        {loading && <LoadingDots className="text-background" />}
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg p-0"
        side={isMobile ? 'bottom' : 'top'}
        align="start"
        sideOffset={16}
      >
        <div className="flex items-center gap-2 px-3 py-2 text-left text-sm">
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

        {/* <PopoverSeparator /> */}

        {/* <PopoverGroup>
          <PopoverLabel>Sites</PopoverLabel>
          {sites.map((site) => (
            <MenuItem
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
                {session?.activeSpaceId === site.id && <CheckIcon />}
              </div>
            </MenuItem>
          ))}
        </PopoverGroup> */}
        {!isMobileApp && <Separator />}

        {!isMobileApp && (
          <div className="p-1">
            <MenuItem
              onClick={async () => {
                if (typeof onOpenSettings === 'function') {
                  return onOpenSettings()
                }
                settings.setOpen(true)
                // if (isExtension) {
                //   window.open(`${ROOT_HOST}/~/settings`)
                //   return
                // }
                // if (isDesktop) {
                //   console.log('is desktop....')
                //   return
                // }
                // appEmitter.emit('ROUTE_TO_SETTINGS')
              }}
            >
              <CogIcon className="size-5" />
              <Trans>Settings</Trans>
            </MenuItem>

            {/* <MenuItem>
                <CreditCard />
                <Trans>Billing</Trans>
              </MenuItem> */}

            <MenuItem
              onClick={async () => {
                settings.setOpen(true)
                // const path = `${ROOT_HOST}/~/settings/subscription`
                // if (isExtension) {
                //   window.open(path)
                //   return
                // }
                // location.href = path
                if (isDesktop) {
                  window.electron.ipcRenderer.send(
                    'open-url',
                    `${ROOT_HOST}/pricing?from=desktop`,
                  )
                }
              }}
            >
              <Sparkles className="size-5" />
              <Trans>Upgrade to Pro</Trans>
            </MenuItem>

            <MenuItem
              onClick={() => {
                window.open('https://discord.gg/nyVpH9njDu')
              }}
            >
              <MessageCircleIcon className="size-5" />
              <Trans>Support</Trans>
            </MenuItem>

            {/* <MenuItem>
                <Bell />
                Notifications
              </MenuItem> */}

            <MenuItem
              className="text-red-500"
              onClick={async () => {
                try {
                  await logout()
                  appEmitter.emit('ON_LOGOUT_SUCCESS')
                } catch (error) {}
              }}
            >
              <LogOut className="size-5" />
              <Trans>Log out</Trans>
            </MenuItem>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
