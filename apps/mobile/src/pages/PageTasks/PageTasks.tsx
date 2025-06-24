import React, { ReactNode, useMemo } from 'react'
import { MobileContent } from '@/components/MobileContent'
import { Trans } from '@lingui/react/macro'
import { addDays, format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { CreationItem } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/CreationItem'
import { TaskNav } from '@penx/constants'
import { Creation } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { sortTasks } from '@penx/libs/sortTasks'
import { IColumn } from '@penx/model-type'
import { Option } from '@penx/types'

interface Props {
  column: IColumn
  option: Option
  type: TaskNav
}

export function PageTasks(props: Props) {
  return <Content {...props} />
}

export function Content({ option, column, type }: Props) {
  const { setState } = useQuickInputOpen()
  const title = useMemo(() => {
    if (option) return option?.name
    if (type === TaskNav.ALL) return <Trans>All tasks</Trans>
    if (type === TaskNav.UPCOMING) return <Trans>Upcoming</Trans>
    return null
  }, [option])
  const { creations: allCreations } = useCreations()

  const creations = allCreations.filter((c) => {
    if (type === TaskNav.ALL) return c.isTask
    if (type === TaskNav.UPCOMING) return c.isTask
    if (!c.isTask) return false
    return c.cells?.[column.id]?.[0] === option?.id
  })

  const content = useMemo(() => {
    if (type === TaskNav.UPCOMING) return <Days creations={creations} />
    return (
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {sortTasks(creations).map((item) => (
            <CreationItem key={item.id} creation={item} />
          ))}
        </AnimatePresence>
      </div>
    )
  }, [creations, type])

  return (
    <MobileContent
      backgroundColor={'#fff'}
      rightSlot={
        option && (
          <div className="pr-2">
            <PlusIcon
              size={24}
              className="text-foreground/60"
              onClick={(e) => {
                setState({
                  isTask: true,
                  open: true,
                  cells: {
                    [column.id]: [option.id],
                  },
                })
              }}
            />
          </div>
        )
      }
      title={title}
    >
      {content}
    </MobileContent>
  )
}

function Days({ creations }: { creations: Creation[] }) {
  const { setState } = useQuickInputOpen()
  const days = Array(7)
    .fill(null)
    .map((_, index) => {
      const date = format(addDays(new Date(), index + 1), 'yyyy-MM-dd')
      let label: ReactNode = format(new Date(date), 'MM/dd')
      // if (index === 0) label = <Trans>Today</Trans>
      if (index === 0) label = <Trans>Tomorrow</Trans>

      const weekdayAbbr = [
        <Trans>Sun</Trans>,
        <Trans>Mon</Trans>,
        <Trans>Tue</Trans>,
        <Trans>Wed</Trans>,
        <Trans>Thu</Trans>,
        <Trans>Fri</Trans>,
        <Trans>Sat</Trans>,
      ]
      const dayNum = new Date(date).getDay()
      return {
        date,
        label,
        weekDay: weekdayAbbr[dayNum],
      }
    })
  return (
    <div className="flex flex-col gap-4">
      {days.map((day) => {
        const list = creations.filter((c) => c.date === day.date)
        return (
          <div key={day.date} className="flex flex-col gap-2">
            <div
              className="flex h-10 items-center justify-between"
              onClick={() => {
                //
              }}
            >
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">{day.label}</div>
                <div className="mt-1 text-xs font-light">{day.weekDay}</div>
              </div>
              <PlusIcon
                size={24}
                className="text-foreground/60"
                onClick={(e) => {
                  e.stopPropagation()

                  setState({
                    isTask: true,
                    open: true,
                    date: day.date,
                  })
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {sortTasks(list).map((item) => (
                  <CreationItem key={item.id} creation={item} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}
