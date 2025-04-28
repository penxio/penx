'use client'

import { ReactNode, useState } from 'react'
import { Trans } from '@lingui/react'
import { Mold } from '@penx/db/client'
import {
  Calendar,
  FilePenLine,
  GroupIcon,
  Rows4Icon,
  StarIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAreaContext } from '@penx/components/AreaContext'
import { AddNoteDialog } from '@penx/components/Creation/AddNoteDialog/AddNoteDialog'
import { editorDefaultValue, WidgetType } from '@penx/constants'
import { useMoldsContext } from '@penx/contexts/MoldsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { addWidget } from '@penx/hooks/useArea'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { getMoldName } from '@penx/libs/getMoldName'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { CreationType } from '@penx/types'
import LoadingCircle from '@penx/uikit/components/icons/loading-circle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { Separator } from '@penx/uikit/ui/separator'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useAddNoteDialog } from '../../Creation/AddNoteDialog/useAddNoteDialog'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function AddWidgetButton({ className }: Props) {
  const site = useSiteContext()

  const { session } = useSession()
  const [isLoading, setLoading] = useState(false)
  const [type, setType] = useState<CreationType>('' as any)
  const [open, setOpen] = useState(false)
  const addNoteDialog = useAddNoteDialog()
  const area = useAreaContext()
  const molds = useMoldsContext()

  async function addMoldWidget(mold: Mold) {
    setOpen(false)
    await addWidget(session?.activeAreaId, {
      id: uniqueId(),
      type: WidgetType.MOLD,
      moldId: mold.id,
      collapsed: false,
    })
  }

  async function addBuiltinWidget(type: string) {
    setOpen(false)
    await addWidget(session?.activeAreaId, {
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
        <PopoverContent align="start" className="w-48 p-2">
          {Object.values(WidgetType).map((item) => {
            const getName = () => {
              if (item === WidgetType.ALL_CREATIONS) {
                return (
                  <>
                    <Rows4Icon size={16} />
                    <Trans id="All creations"></Trans>
                  </>
                )
              }

              if (item === WidgetType.COLLECTION) {
                return (
                  <>
                    <GroupIcon size={16} />
                    <Trans id="Collection"></Trans>
                  </>
                )
              }
              if (item === WidgetType.FAVORITES) {
                return (
                  <>
                    <StarIcon size={16} />
                    <Trans id="Favorites"></Trans>
                  </>
                )
              }
              if (item === WidgetType.RECENTLY_EDITED) {
                return (
                  <>
                    <FilePenLine size={16} />
                    <Trans id="Recently edited"></Trans>
                  </>
                )
              }
              if (item === WidgetType.RECENTLY_OPENED) {
                return (
                  <>
                    <Calendar size={16} />
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
                {getName()}
              </Item>
            )
          })}

          {molds.map((item) => {
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
