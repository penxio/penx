import { useRef, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useSize } from 'ahooks'
import { format } from 'date-fns'
import { CalendarDays, CalendarDaysIcon, CalendarIcon } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { PropItem } from './PropItem'
import { TaskDate } from './TaskDate'

interface Props {
  className?: string
  struct: Struct
  creation: Creation
  onUpdateProps: (cells: any) => any
  isPanel?: boolean
}

export const PropList = ({
  struct,
  creation,
  onUpdateProps,
  className,
  isPanel,
}: Props) => {
  const ref = useRef(null)
  const size = useSize(ref)
  if (!struct) return null

  if (struct.columns.length < 2) return null
  return (
    <div ref={ref} className={cn('mt-4 flex flex-col gap-2', className)}>
      {struct.columns.map((column, i) => {
        if (!size?.width) return null
        return (
          <PropItem
            key={column.id}
            creation={creation}
            column={column}
            struct={struct}
            containerWidth={size?.width!}
            isPanel={isPanel}
            onUpdateProps={onUpdateProps}
          />
        )
      })}

      {struct.isTask && <TaskDate isPanel={isPanel} creation={creation} />}
    </div>
  )
}
