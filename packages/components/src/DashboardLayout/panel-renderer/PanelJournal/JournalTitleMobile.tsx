'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { isMobileApp } from '@penx/constants'
import { useJournal } from '@penx/hooks/useJournal'
import { useJournals } from '@penx/hooks/useJournals'
import { store } from '@penx/store'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { JournalShortcut } from './JournalShortcut'
import { StructTypeSelect } from './StructTypeSelect'

interface Props {
  initialDate: Date
}

export function JournalTitleMobile({ initialDate }: Props) {
  const [date, setDate] = useState<Date>(initialDate || new Date())
  const [open, setOpen] = useState(false)

  const { journal } = useJournal()

  useEffect(() => {
    if (format(date, 'yyyy-MM-dd') !== journal.date) {
      setDate(new Date(journal.date))
    }
  }, [journal.date])

  const { journals } = useJournals()
  const daysWithNotes = journals.reduce<Date[]>((acc, journal) => {
    if (!journal.hasNotes) return acc
    return [...acc, new Date(journal.date)]
  }, [])

  return (
    <div className="flex items-center justify-between">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1">
            <div className="text-3xl font-bold">
              {format(new Date(date), 'LLL do')}
            </div>
            <span className="icon-[ion--caret-down] text-foreground/90 size-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent isPortal className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            modifiers={{
              hasNotes: daysWithNotes,
            }}
            modifiersClassNames={{
              hasNotes: 'day-with-notes',
            }}
            onSelect={(date) => {
              console.log('========date:', date)

              setOpen(false)
              if (date) {
                setDate(date!)
                store.journals.goToDay(date)
              }
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
      {isMobileApp && <StructTypeSelect />}
    </div>
  )
}
