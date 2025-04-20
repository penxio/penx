'use client'

import { ReactNode, useState } from 'react'
import { useAreaContext } from '@/components/AreaContext'
import { AddNoteDialog } from '@/components/Creation/AddNoteDialog/AddNoteDialog'
import { useAddNoteDialog } from '@/components/Creation/AddNoteDialog/useAddNoteDialog'
import LoadingCircle from '@/components/icons/loading-circle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@penx/session'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import { Separator } from '@penx/uikit/ui/separator'
import { addWidget } from '@/hooks/useAreaItem'
import { editorDefaultValue, WidgetType } from '@penx/constants'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { getCreationIcon } from '@/lib/getCreationIcon'
import { getMoldName } from '@/lib/getMoldName'
import { useRouter } from '@/lib/i18n'
import { CreationType } from '@penx/types'
import { api } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react/macro'
import { Mold } from '@prisma/client'
import {
  Calendar,
  FilePenLine,
  GroupIcon,
  Rows4Icon,
  StarIcon,
} from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function AddWidgetButton({ className }: Props) {
  const site = useSiteContext()

  const { push } = useRouter()
  const { session } = useSession()
  const [isLoading, setLoading] = useState(false)
  const [type, setType] = useState<CreationType>('' as any)
  const [open, setOpen] = useState(false)
  const addNoteDialog = useAddNoteDialog()
  const field = useAreaContext()

  async function addMoldWidget(mold: Mold) {
    setOpen(false)
    await addWidget(session?.activeAreaId!, {
      id: uniqueId(),
      type: WidgetType.MOLD,
      moldId: mold.id,
      collapsed: false,
    })
  }

  async function addBuiltinWidget(type: string) {
    setOpen(false)
    await addWidget(session?.activeAreaId!, {
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
            <Trans>Add widget</Trans>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-2">
          {Object.values(WidgetType).map((item) => {
            const getName = () => {
              if (item === WidgetType.ALL_CREATIONS) {
                return (
                  <>
                    <Rows4Icon size={16} />
                    <Trans>All creations</Trans>
                  </>
                )
              }

              if (item === WidgetType.COLLECTION) {
                return (
                  <>
                    <GroupIcon size={16} />
                    <Trans>Collection</Trans>
                  </>
                )
              }
              if (item === WidgetType.FAVORITES) {
                return (
                  <>
                    <StarIcon size={16} />
                    <Trans>Favorites</Trans>
                  </>
                )
              }
              if (item === WidgetType.RECENTLY_EDITED) {
                return (
                  <>
                    <FilePenLine size={16} />
                    <Trans>Recently edited</Trans>
                  </>
                )
              }
              if (item === WidgetType.RECENTLY_OPENED) {
                return (
                  <>
                    <Calendar size={16} />
                    <Trans>Recently opened</Trans>
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
                {getName()}
              </Item>
            )
          })}

          {site.molds.map((item) => {
            const name = getMoldName(item)
            return (
              <Item
                key={item.id}
                className="flex gap-2"
                onClick={async () => {
                  await addMoldWidget(item)
                }}
              >
                {getCreationIcon(item.type)}
                <span>{name}</span>
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
