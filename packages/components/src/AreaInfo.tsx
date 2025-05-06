'use client'

import { Trans } from '@lingui/react'
import { GlobeIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { AreaType } from '@penx/db/client'
import { useArea } from '@penx/hooks/useArea'
import { updateSiteState } from '@penx/hooks/useQuerySite'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { updateSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { cn, getUrl } from '@penx/utils'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { useAreaDialog } from './AreaDialog/useAreaDialog'
import { AreaLink } from './AreaLink'

interface Props {
  className?: string
}

export function AreaInfo({ className }: Props) {
  const { area } = useArea()
  const { setState } = useAreaDialog()
  if (!area) return null

  return (
    <div className={cn('flex justify-between', className)}>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={getUrl(area.logo || '')} />
          <AvatarFallback>{area.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{area.name}</h2>
            {area.type === AreaType.BOOK && (
              <Badge>
                <Trans id="Book"></Trans>
              </Badge>
            )}

            {area.type === AreaType.COLUMN && (
              <Badge>
                <Trans id="Column"></Trans>
              </Badge>
            )}
            {/* <AreaLink></AreaLink> */}
          </div>
          <div className="text-foreground/60">{area.description}</div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="size-9"
          onClick={() => {
            setState({
              isOpen: true,
              area: area,
            })
          }}
        >
          <PencilIcon size={20} className="text-foreground/60" />
        </Button>

        <ConfirmDialog
          title="Delete this area?"
          content="Are you sure you want to delete this area?"
          tooltipContent="Delete this area"
          onConfirm={async () => {
            const areas = await store.areas.deleteArea(area)
            const nextArea = areas.find((a) => a.isGenesis)!
            store.area.set(nextArea)
            store.visit.setAndSave({ activeAreaId: nextArea.id })
            store.creations.refetchCreations(nextArea.id)
          }}
        >
          <Button variant="destructive" size="icon" className="size-9">
            <TrashIcon size={18} className="" />
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}
