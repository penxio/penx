'use client'

import { ReactNode } from 'react'
import { useSignIn } from '@farcaster/auth-kit'
import { Trans } from '@lingui/react'
import { openUrl } from '@tauri-apps/plugin-opener'
import {
  BadgeCheck,
  Bell,
  EllipsisIcon,
  LogOut,
  MessageCircleIcon,
  Moon,
  Sparkles,
  StarIcon,
  StarOffIcon,
  Sun,
  Trash2Icon,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import {
  isDesktop,
  isExtension,
  isWeb,
  LoginStatus,
  ROOT_HOST,
} from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useCreation } from '@penx/hooks/useCreation'
import { useMySite } from '@penx/hooks/useMySite'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
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

interface Props {
  creationId: string
  afterDelete: () => void
}

export function CreationMenu({ creationId, afterDelete }: Props) {
  const isMobile = useIsMobile()
  const { data, isLoading, refetch } = useCreation(creationId)
  const { area } = useArea()
  const isFavor = area.favorites?.includes(creationId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-48 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              if (isFavor) {
                await store.area.removeFromFavorites(creationId)
              } else {
                await store.area.addToFavorites(creationId)
              }
            }}
          >
            {isFavor && <StarOffIcon />}
            {!isFavor && <StarIcon />}
            {isFavor ? (
              <Trans id="Remove favorites"></Trans>
            ) : (
              <Trans id="Add favorites"></Trans>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            store.creations.deleteCreation(data!)
            afterDelete?.()
          }}
        >
          <Trash2Icon />
          <Trans id="Delete"></Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
