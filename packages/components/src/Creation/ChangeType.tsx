'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { Creation } from '@penx/domain'
import {
  updateCreationProps,
  updateCreationState,
} from '@penx/hooks/useCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { StructName } from '@penx/widgets/StructName'

export function ChangeType({ creation }: { creation: Creation }) {
  const { structs } = useStructs()
  const [open, setOpen] = useState(false)
  const struct = structs.find((m) => m.id === creation.structId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="xs"
          variant="ghost"
          className="text-foreground/60 -ml-2 h-7 gap-1 rounded-full px-2 text-xs"
        >
          <StructName struct={struct!} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <div className="mb-1 pl-2 text-sm font-semibold">
          <Trans>Change type</Trans>
        </div>
        {structs.map((struct) => {
          return (
            <Item
              key={struct.id}
              className="flex gap-2"
              onClick={async () => {
                setOpen(false)
                updateCreationProps(creation.id, {
                  type: struct.type,
                  structId: struct.id,
                })
              }}
            >
              {getCreationIcon(struct.type)}
              <span>
                <StructName struct={struct!} />
              </span>
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
