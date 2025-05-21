'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { goToDay } from '@penx/hooks/useJournal'
import { useRouter } from '@penx/libs/i18n'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'

interface Props {
  initialDate: Date
}

export function GoToDay({ initialDate }: Props) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date())
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CalendarDays size={20} className="text-foreground/60 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            // console.log('========date:', date)
            setOpen(false)
            setDate(date)
            date && goToDay(date)
          }}
          // disabled={(date) =>
          //   date > new Date() || date < new Date('1900-01-01')
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
