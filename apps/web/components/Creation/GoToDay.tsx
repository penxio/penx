'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRouter } from '@/lib/i18n'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'

interface Props {
  initialDate: Date
}

export function GoToDay({ initialDate }: Props) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date())
  const [open, setOpen] = useState(false)
  const { push } = useRouter()

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
            const dateStr = format(date!, 'yyyy-MM-dd')
            push(`/~/page?id=${dateStr}`)
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
