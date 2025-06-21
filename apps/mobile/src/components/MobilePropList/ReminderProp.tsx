import { format, isDate, setHours, setMinutes } from 'date-fns'
import { ChevronRightIcon } from 'lucide-react'
import { Creation } from '@penx/domain'
import { isReminder, ReminderState } from '@penx/libs/isReminder'
import { IColumn } from '@penx/model-type'
import { cn } from '@penx/utils'
import { ReminderDrawer } from './ReminderDrawer'

interface Props {
  creation: Creation
  column: IColumn
  value: ReminderState
  onChange?: (value: ReminderState) => void
}
export const ReminderProp = ({ value, column, creation, onChange }: Props) => {
  return (
    <ReminderDrawer
      className="h-full w-full"
      creation={creation}
      column={column}
      value={value}
      onChange={(v) => {
        onChange?.(v)
      }}
    >
      {({ date }) => (
        <div
          className={cn(
            'text-foreground flex h-full w-full items-center justify-end px-3',
          )}
        >
          {date && format(date, 'yyyy-MM-dd HH:mm')}
          <ChevronRightIcon className="text-foreground/50 size-5" />
        </div>
      )}
    </ReminderDrawer>
  )
}
