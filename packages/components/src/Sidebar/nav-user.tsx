'use client'

import { useSignIn } from '@farcaster/auth-kit'
import { Trans } from '@lingui/react/macro'
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
import { useRouter } from 'next/navigation'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useMySites } from '@penx/hooks/useMySites'
import { resetPanels, updatePanels } from '@penx/hooks/usePanels'
import { updateSiteState } from '@penx/hooks/useSite'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { MySite } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@penx/uikit/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@penx/uikit/ui/sidebar'
import { getUrl, sleep } from '@penx/utils'
import { usePlanListDialog } from '../PlanList/usePlanListDialog'

export function NavUser() {
  const site = useSiteContext()
  const { data: sites = [], error } = useMySites()
  const { session, data, logout, update } = useSession()
  const { isMobile } = useSidebar()
  const { setIsOpen } = usePlanListDialog()
  const { push } = useRouter()
  const sigInState = useSignIn({})

  async function selectSite(site: MySite) {
    updateSiteState(site)

    const field = site.areas.find((field) => field.isGenesis) || site.areas[0]

    // window.__SITE_ID__ = site.id
    update({
      type: 'update-props',
      activeSiteId: site.id,
      activeAreaId: field.id,
    })

    resetPanels()
    push(`/~/areas/${field.id}`)
  }

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

        <DropdownMenuGroup>
          <DropdownMenuLabel>Sites</DropdownMenuLabel>
          {sites.map((site) => (
            <DropdownMenuItem
              key={site.id}
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                selectSite(site)
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              push('/~/settings')
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
            onClick={() => {
              setIsOpen(true)
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

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await logout()
              sigInState?.signOut()
              push('/')
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
