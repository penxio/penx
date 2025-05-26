'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { goToDay } from '@penx/hooks/useJournal'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { JournalShortcut } from './JournalShortcut'

interface Props {
  initialDate: Date
}

export function JournalTitleMobile({ initialDate }: Props) {
  const [date, setDate] = useState<Date>(initialDate || new Date())
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1">
          <div className="text-3xl font-bold">
            {format(new Date(date), 'LLL do')}
          </div>
          <span className="icon-[ion--caret-down] text-foreground/90 size-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent isPortal className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            // console.log('========date:', date)
            setOpen(false)
            setDate(date!)
            date && goToDay(date)
          }}
          initialFocus
          footer={
            <div className="mt-2 flex items-center justify-center">
              <JournalShortcut
                date={initialDate}
                onSelect={(date) => {
                  setDate(date)
                  setOpen(false)
                }}
              />
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  )
}
