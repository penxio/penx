'use client'

import { useSignIn } from '@farcaster/auth-kit'
import { Trans } from '@lingui/react'
import {
  BadgeCheck,
  Bell,
  CheckIcon,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  MessageCircleIcon,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { appEmitter } from '@penx/emitter'
import { useMySite } from '@penx/hooks/useMySite'
import { useMySites } from '@penx/hooks/useMySites'
import { updateSiteState } from '@penx/hooks/useSite'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { MySite } from '@penx/types'
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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@penx/uikit/sidebar'
import { getUrl, sleep } from '@penx/utils'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { usePlanListDialog } from '../PlanList/usePlanListDialog'

export function NavUser() {
  const { site } = useMySite()
  // const { data: sites = [], error } = useMySites()
  const { session, data, logout, update } = useSession()
  const { isMobile } = useSidebar()
  const { setIsOpen } = usePlanListDialog()
  const sigInState = useSignIn({})
  const loginDialog = useLoginDialog()

  // async function selectSite(site: MySite) {
  //   updateSiteState(site)

  //   // window.__SITE_ID__ = site.id
  //   update({
  //     type: 'update-props',
  //     activeSiteId: site.id,
  //   })

  //   await store.panels.resetPanels()
  // }

  if (!session)
    return (
      <div>
        <Button size="sm" onClick={() => loginDialog.setIsOpen(true)}>
          Log in
        </Button>
      </div>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-7 w-7 cursor-pointer rounded-lg">
          <AvatarImage src={getUrl(site.logo || '')} alt={session?.name} />
          <AvatarFallback className="rounded-lg">
            {site?.name?.slice(0, 1)}
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
              <AvatarFallback className="rounded-lg">
                {session?.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.name}</span>
              <span className="truncate text-xs">{session?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

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
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              appEmitter.emit('ROUTE_TO_SETTINGS')
            }}
          >
            <BadgeCheck />
            <Trans id="Settings"></Trans>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
                <CreditCard />
                <Trans id="Billing"></Trans>
              </DropdownMenuItem> */}

          <DropdownMenuItem
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <Sparkles />
            <Trans id="Upgrade to Pro"></Trans>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              window.open('https://discord.gg/nyVpH9njDu')
            }}
          >
            <MessageCircleIcon />
            <Trans id="Support"></Trans>
          </DropdownMenuItem>

          {/* <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await logout()
              sigInState?.signOut()
              appEmitter.emit('ON_LOGOUT_SUCCESS')
            } catch (error) {}
          }}
        >
          <LogOut />
          <Trans id="Log out"></Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
