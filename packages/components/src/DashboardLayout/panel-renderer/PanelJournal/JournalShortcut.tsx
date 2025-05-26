import { forwardRef } from 'react'
import { Trans } from '@lingui/react'
import { addDays, format, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { goToDay } from '@penx/hooks/useJournal'
import { cn } from '@penx/utils'

interface Props {
  date: string | Date
  onSelect?: (date: Date) => void
}

export const JournalShortcut = forwardRef<HTMLDivElement, Props>(
  function DailyShortcut({ date, onSelect, ...rest }, ref) {
    const currentDate = new Date(date ?? Date.now())

    return (
      <div ref={ref} className="flex items-center text-xs" {...rest}>
        <div
          className={cn(
            'bg-foreground/5 hover:bg-foreground/10 cursor-pointer rounded-full px-2 py-[6px] transition-colors',
            isMobileApp && 'font-bold',
          )}
          onClick={() => {
            goToDay(new Date())
            onSelect?.(new Date())
          }}
        >
          <Trans id="Today"></Trans>
        </div>

        <div className="ml-2 flex items-center gap-2">
          <div
            className="bg-foreground/5 hover:bg-foreground/10 cursor-pointer rounded-full px-2 py-[6px] transition-colors"
            onClick={() => {
              const dateStr = format(subDays(currentDate, 1), 'yyyy-MM-dd')
              goToDay(new Date(dateStr))
              onSelect?.(new Date(dateStr))
            }}
          >
            <ChevronLeft size={16} />
          </div>
          <div
            className="bg-foreground/5 hover:bg-foreground/10 cursor-pointer rounded-full px-2 py-[6px] transition-colors"
            onClick={() => {
              const dateStr = format(addDays(currentDate, 1), 'yyyy-MM-dd')
              goToDay(new Date(dateStr))
              onSelect?.(new Date(dateStr))
            }}
          >
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    )
  },
)
