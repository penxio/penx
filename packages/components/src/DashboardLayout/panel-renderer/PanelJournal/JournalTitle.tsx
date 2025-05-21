import { format } from 'date-fns'
import { Badge } from '@penx/uikit/ui/badge'
import { JournalNav } from './JournalNav'

interface Props {
  date: string
}

export const JournalTitle = ({ date }: Props) => {
  const formattedDate = format(new Date(date || Date.now()), 'LLL do')

  const isToday = false
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-2 leading-none">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">{formattedDate}</div>
          {isToday && <Badge>Today</Badge>}
        </div>
        <JournalNav date={date} />
      </div>
    </div>
  )
}
