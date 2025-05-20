import { useState } from 'react'
import { Trans } from '@lingui/react'
import {
  Edit2Icon,
  EllipsisVerticalIcon,
  GlobeIcon,
  ShapesIcon,
  Trash2Icon,
} from 'lucide-react'
import { bgColorMaps } from '@penx/libs/color-helper'
import { useSession } from '@penx/session'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { cn } from '@penx/utils'
import { useLoginDialog } from '@penx/widgets/LoginDialog/useLoginDialog'
import { usePublishStructDialog } from '../PublishStructDialog/usePublishStructDialog'
import { useStructDialog } from '../StructDialog/useStructDialog'
import { useDatabaseContext } from './DatabaseProvider'

export const TableInfo = () => {
  const { struct } = useDatabaseContext()
  const structDialog = useStructDialog()
  const { session } = useSession()
  const loginDialog = useLoginDialog()
  const publishDialog = usePublishStructDialog()

  if (!struct) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-0">
          <div className="flex items-center gap-1 text-base font-bold">
            <span
              className={cn(
                'text-background flex h-5 w-5 items-center justify-center rounded-full text-sm',
                bgColorMaps[struct.color] || 'bg-foreground/50',
              )}
            >
              <ShapesIcon size={12} />
            </span>
            <span>{struct.name || 'Untitled'}</span>
          </div>
          <EllipsisVerticalIcon size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuItem
          onClick={async () => {
            structDialog.setState({ isOpen: true, struct })
          }}
        >
          <Edit2Icon />
          <Trans id="Edit struct"></Trans>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={async () => {
            if (!session) return loginDialog.setIsOpen(true)
            publishDialog.setState({ isOpen: true, struct })
          }}
        >
          <GlobeIcon />
          <Trans id="Publish to marketplace"></Trans>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={async () => {
            //
          }}
        >
          <Trash2Icon />
          <Trans id="Delete"></Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
