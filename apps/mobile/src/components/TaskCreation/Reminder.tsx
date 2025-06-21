import { format } from 'date-fns'
import { AlarmClockIcon } from 'lucide-react'
import { RepeatTypes } from '@penx/constants'
import { Creation, Struct } from '@penx/domain'
import { isReminder } from '@penx/libs/isReminder'
import { ReminderDrawer } from '../MobilePropList/ReminderDrawer'

interface ItemProps {
  className?: string
  struct: Struct
  creation: Creation
  onClick?: () => void
}

export function Reminder({ struct, creation }: ItemProps) {
  const column = struct.columns.find((c) => c.slug === 'reminder')!
  const value = creation.cells[column?.id!]

  return (
    <ReminderDrawer
      className=""
      creation={creation}
      column={column}
      value={
        isReminder(value)
          ? value
          : { date: undefined, repeat: RepeatTypes.NONE }
      }
    >
      {({ date }) => (
        <div className="flex items-center gap-1 text-base">
          <AlarmClockIcon size={20} />
          {date && format(new Date(date), 'MM/dd HH:mm')}
        </div>
      )}
    </ReminderDrawer>
  )
}
