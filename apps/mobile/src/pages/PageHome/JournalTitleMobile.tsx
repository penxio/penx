'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { JournalShortcut } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/JournalShortcut'
import { isMobileApp } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useCreations } from '@penx/hooks/useCreations'
import { useJournal } from '@penx/hooks/useJournal'
import { useJournals } from '@penx/hooks/useJournals'
import { store } from '@penx/store'
import { Calendar } from '@penx/uikit/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'

interface Props {
  initialDate: Date
}

export function JournalTitleMobile({ initialDate }: Props) {
  const { creations } = useCreations()
  const [date, setDate] = useState<Date>(initialDate || new Date())
  const [open, setOpen] = useState(false)

  const { journal } = useJournal()

  useEffect(() => {
    if (format(date, 'yyyy-MM-dd') !== format(initialDate, 'yyyy-MM-dd')) {
      setDate(new Date(journal.date))
    }
  }, [initialDate])

  const daysWithNotes = creations
    .reduce<string[]>((acc, item) => {
      const date = item.date
      if (acc.includes(date)) return acc
      return [...acc, date]
    }, [])
    .map((date) => new Date(date))

  return (
    <div className="flex items-center justify-between">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1">
            <div className="text-2xl font-bold">
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
      {/* {isMobileApp && <StructTypeSelect />} */}
    </div>
  )
}
