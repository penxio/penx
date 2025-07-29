import { useState } from 'react'
import { impact } from '@/lib/impact'
import { format } from 'date-fns'
import { MobileCalendar } from '@penx/uikit/ui/mobile-calendar'
import { cn } from '@penx/utils'
import { Drawer } from '../ui/Drawer'

interface Props {
  value: string
  onChange: (v: Date | undefined) => void
}
export const DateProp = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        className={cn(
          'text-foreground flex h-full w-full items-center justify-end px-3',
        )}
        onClick={async () => {
          impact()
          setOpen(true)
        }}
      >
        {value ? (
          format(new Date(value), 'yyyy-MM-dd')
        ) : (
          <Trans>Pick a date</Trans>
        )}
      </div>

      <Drawer open={open} setOpen={setOpen} className="bg-background">
        <MobileCalendar
          className=""
          mode="single"
          selected={new Date(value as string)}
          onSelect={async (date) => {
            onChange(date)
            setOpen(false)
            impact()
          }}
        />
      </Drawer>
    </>
  )
}
