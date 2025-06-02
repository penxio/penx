'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { useJournal } from '@penx/hooks/useJournal'
import { store } from '@penx/store'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'

const MotionCalendarDays = motion.create(CalendarDays)

interface Props {
  initialDate: Date
}

export function GoToDay({ initialDate }: Props) {
  const [date, setDate] = useState<Date>(initialDate || new Date())
  const [open, setOpen] = useState(false)

  const { journal } = useJournal()
  useEffect(() => {
    if (format(date, 'yyyy-MM-dd') !== journal.date) {
      setDate(new Date(journal.date))
    }
  }, [journal.date])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <MotionCalendarDays
          whileTap={{ scale: 1.2, opacity: 0.95 }}
          size={20}
          className={cn(
            'text-foreground/60 cursor-pointer',
            isMobileApp && 'text-foreground',
          )}
        />
      </PopoverTrigger>
      <PopoverContent isPortal className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            console.log('========date:', date)
            setOpen(false)

            console.log('====date:', date)

            if (date) {
              setDate(date)
              store.journals.goToDay(date)
            }
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
