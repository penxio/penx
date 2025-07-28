import React, { ReactNode, useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { addDays, format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { CreationItem } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/CreationItem'
import { TaskNav } from '@penx/constants'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { sortTasks } from '@penx/libs/sortTasks'
import { IColumn, IStructNode } from '@penx/model-type'
import { Option } from '@penx/types'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { cn } from '@penx/utils'
import { creationToCommand } from '~/lib/creationToCommand'
import { CommandGroup } from '../../CommandComponents'
import { ListItemUI } from '../../ListItemUI'

interface Props {
  creations: Creation[]
}

export function TaskCommandList({ creations }: Props) {
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
    <div
      className={cn('flex-[2] overflow-auto p-2')}
      style={{
        overscrollBehavior: 'contain',
        scrollPaddingBlockStart: 8,
        scrollPaddingBlockEnd: 8,
        position: 'relative',
      }}
    >
      {days.map((day) => {
        const list = creations.filter((c) => c.date === day.date)
        return (
          <CommandGroup
            heading={
              <div
                className="flex h-10 items-center justify-between"
                onClick={() => {
                  //
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-xs font-bold">{day.label}</div>
                  <div className="mt-1 text-xs font-light">{day.weekDay}</div>
                </div>
                <PlusIcon
                  size={16}
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
            }
          >
            {list.map((item, index) => {
              return (
                <ListItemUI
                  key={index}
                  prefix={
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={item.checked}
                      onCheckedChange={(v) => {
                        updateCreationProps(item.id, {
                          checked: v as any,
                        })
                      }}
                    />
                  }
                  index={index}
                  showIcon={false}
                  value={item.id}
                  item={creationToCommand(item)}
                />
              )
            })}
          </CommandGroup>
        )
        return (
          <div key={day.date} className="flex flex-col gap-2">
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

  // return (
  //   <CommandGroup
  //     className={cn(
  //       'flex-[2] overflow-auto p-2',
  //       // struct.isTask && 'flex-[2]',
  //     )}
  //     style={{
  //       overscrollBehavior: 'contain',
  //       scrollPaddingBlockStart: 8,
  //       scrollPaddingBlockEnd: 8,
  //       position: 'relative',
  //     }}
  //   >
  //     {creations.map((item, index) => {
  //       return (
  //         <ListItemUI
  //           key={index}
  //           prefix={
  //             <Checkbox
  //               onClick={(e) => e.stopPropagation()}
  //               checked={item.checked}
  //               onCheckedChange={(v) => {
  //                 updateCreationProps(item.id, {
  //                   checked: v as any,
  //                 })
  //               }}
  //             />
  //           }
  //           index={index}
  //           showIcon={false}
  //           value={item.id}
  //           item={creationToCommand(item)}
  //         />
  //       )
  //     })}
  //   </CommandGroup>
  // )
}
