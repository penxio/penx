'use client'

import { memo } from 'react'
import { useSession } from '@/components/session'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSite } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getDashboardPath } from '@/lib/getDashboardPath'
import { usePathname, useRouter } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useSignIn } from '@farcaster/auth-kit'
import { Trans } from '@lingui/react/macro'
import {
  DatabaseBackup,
  FileText,
  Gauge,
  Home,
  KeySquare,
  LogOut,
  Settings,
} from 'lucide-react'
import { ProfileAvatar } from './ProfileAvatar'

interface Props {
  className?: string
  showName?: boolean
  showDropIcon?: boolean
}

export const ProfilePopover = memo(function ProfilePopover({
  showName,
  showDropIcon = false,
  className = '',
}: Props) {
  const { data, logout } = useSession()
  const { push } = useRouter()
  const sigInState = useSignIn({})
  const pathname = usePathname()

  if (!data) return <div></div>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileAvatar
          showName={showName}
          showDropIcon={showDropIcon}
          image={data?.image || ''}
          className={cn('cursor-pointer', className)}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="grid gap-2">
          <ProfileAvatar showName showCopy image={data?.image || ''} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              push('/wallet')
            }}
          >
            <Wallet className="mr-2 h-4 w-4" />
            <span>Wallet</span>
          </DropdownMenuItem> */}

          {pathname !== '/' && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                push('/')
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>
                <Trans>Home</Trans>
              </span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              if (location.host === ROOT_DOMAIN) {
                const path = `/~/areas/${data.activeAreaId}`
                push(path)
                return
              }
              window.open(`${location.protocol}//${ROOT_DOMAIN}/~`)
            }}
          >
            <Gauge className="mr-2 h-4 w-4" />
            <span>
              <Trans>Dashboard</Trans>
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              const path = '/~/settings'
              if (location.host === ROOT_DOMAIN) {
                push(path)
                return
              }
              window.open(`${location.protocol}//${ROOT_DOMAIN}${path}`)
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>
              <Trans>Settings</Trans>
            </span>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  push('/~/access-token')
                }}
              >
                <KeySquare className="mr-2 h-4 w-4" />
                <span>Access Token</span>
              </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            try {
              await logout()
              sigInState?.signOut()
              push('/')
            } catch (error) {}
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>
            <Trans>Log out</Trans>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
