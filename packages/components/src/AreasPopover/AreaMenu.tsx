'use client'

import { ReactNode } from 'react'
import { Trans } from '@lingui/react/macro'
import { openUrl } from '@tauri-apps/plugin-opener'
import {
  BadgeCheck,
  Bell,
  CogIcon,
  LogOut,
  MessageCircleIcon,
  Moon,
  Sparkles,
  Sun,
  TrashIcon,
} from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
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
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { PencilEditIcon } from '../../icons'
import { useAreaDialog } from '../AreaDialog/useAreaDialog'
import { DeleteAreaDialog } from './DeleteAreaDialog/DeleteAreaDialog'
import { useDeleteAreaDialog } from './DeleteAreaDialog/useDeleteAreaDialog'

interface Props {
  // area: Area
}

export function AreaMenu({}: Props) {
  const { area, raw } = useArea()
  const areaDialog = useAreaDialog()
  const deleteDialog = useDeleteAreaDialog()

  return (
    <>
      <DeleteAreaDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-foreground/7 text-foreground/80 flex size-7 rounded-md"
            size="icon"
            onClick={async (e) => {
              e.stopPropagation()
              e.preventDefault()
              // await store.panels.resetPanels()
            }}
          >
            <CogIcon size={18} className="text-foreground/60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side="bottom"
          align="start"
          // sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation()

                areaDialog.setState({
                  isOpen: true,
                  area: area,
                })
              }}
            >
              <PencilEditIcon size={20} />
              <Trans>Settings</Trans>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                deleteDialog.setState({
                  isOpen: true,
                  area: area,
                })
              }}
            >
              <TrashIcon />
              <Trans>Delete</Trans>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
