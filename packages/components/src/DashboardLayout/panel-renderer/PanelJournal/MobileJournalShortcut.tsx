import { forwardRef } from 'react'
import { Trans } from '@lingui/react/macro'
import { addDays, format, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

interface Props {
  date: string | Date
  onSelect?: (date: Date) => void
}

export const MobileJournalShortcut = forwardRef<HTMLDivElement, Props>(
  function DailyShortcut({ date, onSelect, ...rest }, ref) {
    const currentDate = new Date(date ?? Date.now())

    return (
      <div ref={ref} className="flex items-center text-xs" {...rest}>
        <Button
          className={cn('')}
          onClick={() => {
            store.journals.goToDay(new Date())
            onSelect?.(new Date())
          }}
        >
          <Trans>Today</Trans>
        </Button>

        <div className="ml-2 flex items-center gap-2">
          <Button
            variant="outline-solid"
            className=""
            onClick={() => {
              const dateStr = format(subDays(currentDate, 1), 'yyyy-MM-dd')
              store.journals.goToDay(new Date(dateStr))
              onSelect?.(new Date(dateStr))
            }}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline-solid"
            className=""
            onClick={() => {
              const dateStr = format(addDays(currentDate, 1), 'yyyy-MM-dd')
              store.journals.goToDay(new Date(dateStr))
              onSelect?.(new Date(dateStr))
            }}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    )
  },
)
