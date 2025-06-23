import React, { ReactNode, useEffect, useMemo, useRef } from 'react'
import { impact } from '@/lib/impact'
import { sortTasks } from '@/lib/sortTasks'
import { Trans } from '@lingui/react/macro'
import { addDays, format } from 'date-fns'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { CreationItem } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/CreationItem'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { SectionType } from './utils'

interface TaskSectionProps {
  sectionType: string
  creations: Creation[]
}
export function TaskSection({ sectionType, creations }: TaskSectionProps) {
  const { setState } = useQuickInputOpen()
  const labelMaps = {
    [SectionType.TODAY]: <Trans>Today</Trans>,
    [SectionType.TOMORROW]: <Trans>Tomorrow</Trans>,
    [SectionType.UPCOMING]: <Trans>Upcoming</Trans>,
    [SectionType.ALL]: <Trans>All</Trans>,
  }
  return (
    <div className="space-y-3">
      <Title
        label={labelMaps[sectionType]}
        canNav={[SectionType.UPCOMING, SectionType.ALL].includes(
          sectionType as SectionType,
        )}
        onClick={() => {
          if (
            [SectionType.UPCOMING, SectionType.ALL].includes(
              sectionType as SectionType,
            )
          ) {
            appEmitter.emit('ROUTE_TO_TASKS', {
              type: sectionType,
            })

            impact()
          }
        }}
        canAdd={[SectionType.TODAY, SectionType.TOMORROW].includes(
          sectionType as SectionType,
        )}
        onAdd={() => {
          impact()
          const add = sectionType === SectionType.TOMORROW ? 1 : 0
          setState({
            isTask: true,
            open: true,
            date: format(addDays(new Date(), add), 'yyyy-MM-dd'),
          })
        }}
      />
      {[SectionType.TODAY, SectionType.TOMORROW].includes(
        sectionType as SectionType,
      ) &&
        creations.length > 0 && (
          <div className="flex flex-col gap-3">
            {sortTasks(creations).map((item) => (
              <CreationItem key={item.id} creation={item} />
            ))}
          </div>
        )}
    </div>
  )
}

interface TitleProps {
  label: ReactNode
  canAdd?: boolean
  canNav?: boolean
  onClick?: () => void
  onAdd?: () => void
}

function Title({ label, canAdd = true, canNav, onAdd, onClick }: TitleProps) {
  return (
    <div className="flex h-10 items-center justify-between" onClick={onClick}>
      <div className="text-lg font-bold">{label}</div>
      {canAdd && (
        <PlusIcon
          size={24}
          className="text-foreground/60"
          onClick={(e) => {
            e.stopPropagation()
            onAdd?.()
          }}
        />
      )}
      {canNav && <ChevronRightIcon className="text-foreground/50" />}
    </div>
  )
}
