'use client'

import { PropsWithChildren, useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { addDays, format } from 'date-fns'
import { TaskNav } from '@penx/constants'
import { useCreations } from '@penx/hooks/useCreations'
import { getTasksByTaskNav } from '@penx/libs/getTasksByTaskNav'
import { sortTasks } from '@penx/libs/sortTasks'
import { Panel, PanelType, StructType, Widget } from '@penx/types'
import { cn } from '@penx/utils'
import { JournalQuickInput } from '../../../JournalQuickInput'
import { ClosePanelButton } from '../../ClosePanelButton'
import { PanelHeaderWrapper } from '../../PanelHeaderWrapper'
import { TaskItem } from './TaskItem'
import { UpcomingTasks } from './UpcomingTasks'

interface Props {
  panel: Panel
  index: number
}

export function PanelTasks({ panel, index }: Props) {
  const labelMaps: Record<string, any> = {
    [TaskNav.TODAY]: <Trans>Today</Trans>,
    [TaskNav.TOMORROW]: <Trans>Tomorrow</Trans>,
    [TaskNav.UPCOMING]: <Trans>Upcoming</Trans>,
    [TaskNav.ALL]: <Trans>All</Trans>,
  }
  const { creations } = useCreations()
  const tasks = creations.filter((c) => c.isTask)

  const title = useMemo(() => {
    if (panel.option) return panel.option?.name
    if (panel.taskNav === TaskNav.ALL) return <Trans>All tasks</Trans>
    if (panel.taskNav === TaskNav.UPCOMING) return <Trans>Upcoming</Trans>
    return labelMaps[panel.taskNav!]
  }, [panel])

  const headerJsx = (
    <PanelHeaderWrapper index={index}>
      <div className="line-clamp-1 text-sm">{title}</div>
      <ClosePanelButton panel={panel} />
    </PanelHeaderWrapper>
  )

  if (panel.taskNav) {
    const creations = getTasksByTaskNav(tasks, panel.taskNav)
    const add = panel.taskNav === TaskNav.TOMORROW ? 1 : 0
    const date = format(addDays(new Date(), add), 'yyyy-MM-dd')

    if (panel.taskNav === TaskNav.UPCOMING) {
      return (
        <>
          {headerJsx}
          <ContentContainer>
            <div
              className={cn(
                'relative flex w-full flex-1 flex-col overflow-auto pb-20 pt-6',
              )}
            >
              <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
                <UpcomingTasks creations={creations} />
              </div>
            </div>
          </ContentContainer>
        </>
      )
    }

    return (
      <>
        {headerJsx}
        <ContentContainer>
          <div
            className={cn(
              'relative flex w-full flex-1 flex-col overflow-auto pb-20 pt-6',
            )}
          >
            <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
              <div className="text-foreground text-2xl font-bold">{title}</div>

              <div className="flex flex-col gap-3">
                {sortTasks(creations).map((item) => (
                  <TaskItem key={item.id} creation={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-50 px-6 pb-6">
            <div className="sticky bottom-0 mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-2">
              <JournalQuickInput
                isTask
                date={date}
                placeholder="Create a new task"
              />
            </div>
          </div>
        </ContentContainer>
      </>
    )
  }
  if (panel.option) {
    const { column, option } = panel
    const creations = tasks.filter(
      (c) => c.cells?.[column.id]?.[0] === option?.id,
    )
    return (
      <>
        {headerJsx}
        <ContentContainer>
          <div
            className={cn(
              'relative flex w-full flex-1 flex-col overflow-auto pb-20 pt-6',
            )}
          >
            <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
              <div className="text-foreground text-2xl font-bold">{title}</div>

              <div className="flex flex-col gap-3">
                {sortTasks(creations).map((item) => (
                  <TaskItem key={item.id} creation={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-50 px-6 pb-6">
            <div className="sticky bottom-0 mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-2">
              <JournalQuickInput
                isTask
                // date={date}
                cells={{
                  [column.id]: [option.id],
                }}
                placeholder="Create a new task"
              />
            </div>
          </div>
        </ContentContainer>
      </>
    )
  }
  return null
}

function ContentContainer({ children }: PropsWithChildren) {
  return (
    <div className="relative flex-1">
      <div className="absolute bottom-0 left-0 right-0 top-0  flex h-full flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}
