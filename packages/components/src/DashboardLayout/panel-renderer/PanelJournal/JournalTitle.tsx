import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { useJournal } from '@penx/hooks/useJournal'
import { Badge } from '@penx/uikit/ui/badge'
import { cn } from '@penx/utils'
import { JournalNav } from './JournalNav'
import { JournalTitleMobile } from './JournalTitleMobile'

interface Props {
  date: string
}

export const JournalTitle = ({ date }: Props) => {
  const { journal } = useJournal()

  const formattedDate = format(new Date(journal.date), 'LLL do')

  return <JournalTitleMobile initialDate={new Date(date)} />
  // if (isMobileApp) {
  //   return <JournalTitleMobile initialDate={new Date(date)} />
  // }

  // return (
  //   <div
  //     className={cn(
  //       'flex flex-row gap-2 leading-none md:flex-col',
  //       isMobileApp && 'justify-between',
  //     )}
  //   >
  //     <div className="text-3xl font-bold">{formattedDate}</div>

  //     {!isMobileApp && <JournalNav date={date} />}
  //   </div>
  // )
}
