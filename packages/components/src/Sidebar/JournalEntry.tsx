'use client'

import { Calendar1Icon, CalendarDaysIcon, CalendarIcon } from 'lucide-react'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export function JournalEntry() {
  return (
    <div
      className="bg-background flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-all hover:shadow-md"
      onClick={() => {
        store.panels.openJournal(new Date())
      }}
    >
      {/* <CalendarDaysIcon size={16} /> */}
      <div className="font-bold">Journals</div>
    </div>
  )
}
