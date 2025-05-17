'use client'

import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react'
import {
  BotMessageSquareIcon,
  Calendar,
  FilePenLine,
  GroupIcon,
  Rows4Icon,
  StarIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AddNoteDialog } from '@penx/components/AddNoteDialog'
import { editorDefaultValue, WidgetType } from '@penx/constants'
import { Mold } from '@penx/domain'
import { useArea } from '@penx/hooks/useArea'
import { useMolds } from '@penx/hooks/useMolds'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import { Button } from '@penx/uikit/button'
import LoadingCircle from '@penx/uikit/loading-circle'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Separator } from '@penx/uikit/separator'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { MoldName } from '@penx/widgets/MoldName'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { useAddNoteDialog } from '../Creation/AddNoteDialog/useAddNoteDialog'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function AddWidgetButton({ className }: Props) {
  const [isLoading, setLoading] = useState(false)
  const [type, setType] = useState<CreationType>('' as any)
  const [open, setOpen] = useState(false)
  const addNoteDialog = useAddNoteDialog()
  const { area } = useArea()
  const { molds } = useMolds()

  async function addMoldWidget(mold: Mold) {
    setOpen(false)
    await store.area.addWidget({
      id: uniqueId(),
      type: WidgetType.MOLD,
      moldId: mold.id,
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
      <AddNoteDialog />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="xs"
            variant="secondary"
            disabled={isLoading}
            className="bg-foreground/8 hover:bg-foreground/10"
            onClick={() => setOpen(true)}
          >
            <Trans id="Add widget"></Trans>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-0">
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
                if (item === WidgetType.ALL_CREATIONS) {
                  return (
                    <>
                      <Trans id="All creations"></Trans>
                    </>
                  )
                }

                if (item === WidgetType.COLLECTION) {
                  return (
                    <>
                      <Trans id="Collection"></Trans>
                    </>
                  )
                }

                if (item === WidgetType.FAVORITES) {
                  return (
                    <>
                      <Trans id="Favorites"></Trans>
                    </>
                  )
                }

                if (item === WidgetType.ALL_STRUCTS) {
                  return (
                    <>
                      <Trans id="Favorites"></Trans>
                    </>
                  )
                }
                if (item === WidgetType.RECENTLY_EDITED) {
                  return (
                    <>
                      <Trans id="Recently edited"></Trans>
                    </>
                  )
                }
                if (item === WidgetType.AI_CHAT) {
                  return (
                    <>
                      <Trans id="AI chat"></Trans>
                    </>
                  )
                }
                if (item === WidgetType.RECENTLY_OPENED) {
                  return (
                    <>
                      <Trans id="Recently opened"></Trans>
                    </>
                  )
                }
                return null
              }
              if (item === WidgetType.MOLD) return null
              return (
                <Item
                  key={item}
                  className="flex gap-2"
                  onClick={async () => {
                    await addBuiltinWidget(item)
                  }}
                >
                  <WidgetIcon type={item} molds={molds} />
                  {getName()}
                </Item>
              )
            })}

          <Separator className="my-1"></Separator>
          <div className="text-foreground/50 px-4 py-2 text-xs">Structs</div>

          {molds.map((item) => {
            return (
              <Item
                key={item.id}
                className="flex gap-2"
                onClick={async () => {
                  await addMoldWidget(item)
                }}
              >
                {getCreationIcon(item.type)}
                <span>
                  <MoldName mold={item} />
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
