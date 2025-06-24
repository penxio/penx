import React, { ReactNode, useEffect, useMemo, useRef } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { addDays, format } from 'date-fns'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { CreationItem } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/CreationItem'
import { TaskNav } from '@penx/constants'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { sortTasks } from '@penx/libs/sortTasks'

interface TaskSectionProps {
  taskNav: string
  creations: Creation[]
}
export function TaskSection({ taskNav, creations }: TaskSectionProps) {
  const { setState } = useQuickInputOpen()
  const labelMaps = {
    [TaskNav.TODAY]: <Trans>Today</Trans>,
    [TaskNav.TOMORROW]: <Trans>Tomorrow</Trans>,
    [TaskNav.UPCOMING]: <Trans>Upcoming</Trans>,
    [TaskNav.ALL]: <Trans>All</Trans>,
  }
  return (
    <div className="space-y-3">
      <Title
        label={labelMaps[taskNav]}
        canNav={[TaskNav.UPCOMING, TaskNav.ALL].includes(taskNav as TaskNav)}
        onClick={() => {
          if ([TaskNav.UPCOMING, TaskNav.ALL].includes(taskNav as TaskNav)) {
            appEmitter.emit('ROUTE_TO_TASKS', {
              type: taskNav,
            })

            impact()
          }
        }}
        canAdd={[TaskNav.TODAY, TaskNav.TOMORROW].includes(taskNav as TaskNav)}
        onAdd={() => {
          impact()
          const add = taskNav === TaskNav.TOMORROW ? 1 : 0
          setState({
            isTask: true,
            open: true,
            date: format(addDays(new Date(), add), 'yyyy-MM-dd'),
          })
        }}
      />
      {[TaskNav.TODAY, TaskNav.TOMORROW].includes(taskNav as TaskNav) &&
        creations.length > 0 && (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {sortTasks(creations).map((item) => (
                <CreationItem key={item.id} creation={item} />
              ))}
            </AnimatePresence>
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
