import { useEffect, useState } from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { AlarmClockIcon, PlusIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { formatTime } from '@penx/utils'
import { IosPickerItem } from './IosPickerItem'
import './embla.css'

interface Props {
  value: string
  onChange: (v: string) => void
}

type State = {
  hour: number
  minute: number
}
export function ReminderTimePicker({ value = '', onChange }: Props) {
  const [hour, minute] = value.split(':')
  const [time, setTime] = useState<State>({
    hour: hour ? Number(hour) : 0,
    minute: minute ? Number(minute) : 0,
  })

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="text-foreground/50 mt-4 flex h-12 w-full items-center gap-2 border-t px-3"
          onClick={() => {
            impact()
          }}
        >
          <AlarmClockIcon size={20} />
          {time ? (
            <span className="text-foreground">
              {formatTime(`${time.hour}:${time.minute}`)}
            </span>
          ) : (
            <span>
              <Trans>Remind me...</Trans>
            </span>
          )}
          <PlusIcon size={20} className="ml-auto" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        isPortal
        side="top"
        align="end"
        alignOffset={8}
        className="w-32 p-0"
      >
        <div className="inline-flex w-full">
          <div className="embla before:border-b-foreground/5 after:border-t-foreground/5 relative flex h-40 w-full before:-top-[0.5px] before:border-b-[0.5px] after:-bottom-[0.5px] after:border-t-[0.5px]">
            <IosPickerItem
              slideCount={24}
              value={time.hour}
              onChange={(v) => {
                let newState = {} as State
                setTime((time) => {
                  newState = { ...time, hour: v }
                  setTimeout(() => {
                    onChange(`${newState.hour}:${newState.minute}`)
                  }, 0)
                  return newState
                })
              }}
            />
            <IosPickerItem
              slideCount={60}
              value={time.minute}
              onChange={(v) => {
                let newState = {} as State
                setTime((time) => {
                  newState = { ...time, minute: v }
                  setTimeout(() => {
                    onChange(`${newState.hour}:${newState.minute}`)
                  }, 0)
                  return newState
                })
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
