'use client'

import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { defaultEditorContent, isMobileApp, WidgetType } from '@penx/constants'
import { Struct } from '@penx/domain'
import { useArea } from '@penx/hooks/useArea'
import { useStructs } from '@penx/hooks/useStructs'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import LoadingCircle from '@penx/uikit/loading-circle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Separator } from '@penx/uikit/separator'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { StructName } from '@penx/widgets/StructName'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function AddWidgetButton({ className }: Props) {
  const [isLoading, setLoading] = useState(false)
  const [type, setType] = useState<StructType>('' as any)
  const [open, setOpen] = useState(false)
  const { area } = useArea()
  const { structs } = useStructs()

  async function addStructWidget(struct: Struct) {
    setOpen(false)
    await store.area.addWidget({
      id: uniqueId(),
      type: WidgetType.STRUCT,
      structId: struct.id,
      collapsed: false,
    })
  }

  async function addBuiltinWidget(type: string) {
    setOpen(false)
    await store.area.addWidget({
      id: uniqueId(),
      collapsed: false,
      type,
    })
  }

  return (
    <div className={cn('flex justify-center')}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="xs"
            variant="secondary"
            disabled={isLoading}
            className="bg-foreground/8 hover:bg-foreground/10"
            onClick={() => setOpen(true)}
          >
            <Trans>Add widget</Trans>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className={cn('w-48 p-0', isMobileApp && 'max-h-60 overflow-auto')}
        >
          {Object.values(WidgetType)
            .filter(
              (i) =>
                ![WidgetType.RECENTLY_OPENED, WidgetType.COLLECTION].includes(
                  i,
                ),
            )
            .map((item) => {
              // if (
              //   item === WidgetType.COLLECTION ||
              //   item === WidgetType.RECENTLY_OPENED
              // ) {
              //   return null
              // }
              const getName = () => {
                if (item === WidgetType.JOURNAL) {
                  return <Trans>Journals</Trans>
                }

                if (item === WidgetType.ALL_CREATIONS) {
                  return <Trans>All creations</Trans>
                }
                if (item === WidgetType.ALL_STRUCTS) {
                  return <Trans>All structs</Trans>
                }

                if (item === WidgetType.COLLECTION) {
                  return <Trans>Collection</Trans>
                }

                if (item === WidgetType.FAVORITES) {
                  return <Trans>Favorites</Trans>
                }

                if (item === WidgetType.RECENTLY_EDITED) {
                  return <Trans>Recently edited</Trans>
                }
                if (item === WidgetType.AI_CHAT) {
                  return <Trans>AI chat</Trans>
                }
                if (item === WidgetType.RECENTLY_OPENED) {
                  return <Trans>Recently opened</Trans>
                }
                return null
              }
              if (item === WidgetType.STRUCT) return null
              return (
                <Item
                  key={item}
                  className="flex gap-2"
                  onClick={async () => {
                    await addBuiltinWidget(item)
                  }}
                >
                  <WidgetIcon type={item} structs={structs} />
                  {getName()}
                </Item>
              )
            })}

          <Separator className="my-1"></Separator>
          <div className="text-foreground/50 px-4 py-2 text-xs">
            <Trans>Structs</Trans>
          </div>

          {structs.map((item) => {
            return (
              <Item
                key={item.id}
                className="flex gap-2"
                onClick={async () => {
                  await addStructWidget(item)
                }}
              >
                {getCreationIcon(item.type)}
                <span>
                  <StructName struct={item} />
                </span>
              </Item>
            )
          })}
        </PopoverContent>
      </Popover>
    </div>
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
        'hover:bg-accent mx-2 flex h-9 cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm',
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
