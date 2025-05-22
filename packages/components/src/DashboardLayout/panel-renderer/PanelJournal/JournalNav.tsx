import { GoToDay } from '../../../GoToDay'
import { JournalShortcut } from './JournalShortcut'

export const JournalNav = ({ date }: { date: string }) => {
  const currentDate = new Date(date ?? Date.now())

  return (
    <div className="text-foreground/60 flex items-center gap-4 text-xs font-normal">
      <JournalShortcut date={date} />
      <GoToDay initialDate={currentDate} />
    </div>
  )
}
