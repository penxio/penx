'use client'

import { useState } from 'react'
import { AddNoteDialog } from '@/components/Creation/AddNoteDialog/AddNoteDialog'
import { useAddNoteDialog } from '@/components/Creation/AddNoteDialog/useAddNoteDialog'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Creation, updateCreationState } from '@/hooks/useCreation'
import { getCreationIcon } from '@/lib/getCreationIcon'
import { getMoldName } from '@/lib/getMoldName'
import { api } from '@/lib/trpc'
import { cn, formatUsername } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'

export function ChangeType({ creation }: { creation: Creation }) {
  const site = useSiteContext()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="xs"
          variant="ghost"
          className="text-foreground/60 -ml-2 h-7 gap-1 rounded-full px-2 text-xs"
        >
          {getMoldName(creation.mold!)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <div className="mb-1 pl-2 text-sm font-semibold">
          <Trans>Change type</Trans>
        </div>
        {site.molds.map((mold) => {
          const name = getMoldName(mold)
          return (
            <Item
              key={mold.id}
              className="flex gap-2"
              onClick={async () => {
                setOpen(false)
                updateCreationState({
                  id: creation.id,
                  type: mold.type,
                  moldId: mold.id,
                  mold: mold,
                })
                await api.creation.update.mutate({
                  id: creation.id,
                  type: mold.type,
                  moldId: mold.id,
                })
              }}
            >
              {getCreationIcon(mold.type)}
              <span>{name}</span>
            </Item>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
interface ItemProps {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  className?: string
  onClick?: () => Promise<void>
}

function Item({
  children,
  isLoading,
  onClick,
  disabled,
  className,
}: ItemProps) {
  return (
    <div
      className={cn(
        'hover:bg-accent flex h-9 cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-none',
        className,
      )}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
    >
      {children}
      {isLoading && <LoadingDots className="bg-foreground/60" />}
    </div>
  )
}
