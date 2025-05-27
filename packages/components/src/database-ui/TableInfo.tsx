import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import {
  Edit2Icon,
  EllipsisVerticalIcon,
  GlobeIcon,
  ShapesIcon,
  Trash2Icon,
} from 'lucide-react'
import { Struct } from '@penx/domain'
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
import { useDeleteStructDialog } from '../DeleteStructDialog/useDeleteStructDialog'
import { usePublishStructDialog } from '../PublishStructDialog/usePublishStructDialog'
import { useStructDialog } from '../StructDialog/useStructDialog'
import { useDatabaseContext } from './DatabaseProvider'

export const TableInfo = ({ struct }: { struct: Struct }) => {
  const structDialog = useStructDialog()
  const { session } = useSession()
  const loginDialog = useLoginDialog()
  const publishDialog = usePublishStructDialog()
  const deleteDialog = useDeleteStructDialog()

  if (!struct) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-0">
          <div className="flex items-center gap-1 text-base font-bold">
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
          <Trans>Edit struct</Trans>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={async () => {
            if (!session) return loginDialog.setIsOpen(true)
            publishDialog.setState({ isOpen: true, struct })
          }}
        >
          <GlobeIcon />
          <Trans>Publish to marketplace</Trans>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={async () => {
            deleteDialog.setState({ isOpen: true, struct })
          }}
        >
          <Trash2Icon />
          <Trans>Delete</Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
