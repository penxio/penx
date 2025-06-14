import React, { useMemo } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { CreationCard } from '@penx/components/CreationCard/CreationCard'
import { isMobileApp, WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournalLayout } from '@penx/hooks/useJournalLayout'
import { useStructs } from '@penx/hooks/useStructs'
import { Widget } from '@penx/types'
import { cn, mappedByKey } from '@penx/utils'
import { WidgetName } from '@penx/widgets/WidgetName'

export function PageWidget({ widget }: { widget: Widget }) {
  return (
    <MobileContent title={<Title widget={widget} />}>
      <Content widget={widget} />
    </MobileContent>
  )
}

function Title({ widget }: { widget: Widget }) {
  const { structs } = useStructs()
  return <WidgetName widget={widget} structs={structs} />
}

function Content({ widget }: { widget: Widget }) {
  const { creations } = useCreations()
  const { area } = useArea()
  const filteredCreations = useMemo(() => {
    if (widget.structId) {
      return creations.filter((c) => c.structId === widget.structId)
    }

    if (widget.type === WidgetType.RECENTLY_OPENED) {
      return [...creations]
        .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
        .slice(0, 50)
    }

    if (widget.type === WidgetType.FAVORITES) {
      const favorites = area.favorites || []
      const creationsMap = mappedByKey(creations, 'id')
      return favorites.map((id) => creationsMap[id])
    }

    return creations
  }, [widget, creations])

  const { isCard, isList } = useJournalLayout()

  return (
    <div
      className={cn(
        isCard ? 'columns-2 gap-x-2 align-top' : 'flex flex-col gap-4 ',
        // isMobileApp && !isCard && 'gap-6',
        isMobileApp && isList && 'gap-0',
      )}
    >
      {filteredCreations.map((creation) => {
        return (
          <CreationCard key={creation.id} creation={creation}></CreationCard>
        )
      })}
    </div>
  )
}
