import React, { ReactNode, useMemo, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { addDays, format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { CreationItem } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/CreationItem'
import { TaskNav } from '@penx/constants'
import { Creation } from '@penx/domain'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { sortTasks } from '@penx/libs/sortTasks'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { JournalQuickInput } from '../../../JournalQuickInput'

export function UpcomingTasks({ creations }: { creations: Creation[] }) {
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
        return <UpcomingTaskItem creations={creations} day={day} />
      })}
    </div>
  )
}

interface UpcomingTaskItemProps {
  creations: Creation[]
  day: {
    date: string
    label: ReactNode
    weekDay: ReactNode
  }
}

export function UpcomingTaskItem({ creations, day }: UpcomingTaskItemProps) {
  const list = creations.filter((c) => c.date === day.date)
  const [open, setOpen] = useState(false)
  return (
    <div key={day.date} className="flex flex-col gap-2">
      <div className="flex h-10 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">{day.label}</div>
          <div className="mt-1 text-xs font-light">{day.weekDay}</div>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <PlusIcon size={24} className="text-foreground/60" />
          </PopoverTrigger>
          <PopoverContent className="w-[400px] border-0 bg-transparent p-0 !shadow-none outline-none">
            <JournalQuickInput
              isTask
              className=""
              date={day.date}
              placeholder="Create a new task"
              afterSubmit={() => {
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
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
}
