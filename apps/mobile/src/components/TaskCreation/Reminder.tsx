import {
  ChangeEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { impact } from '@/lib/impact'
import { Trans } from '@lingui/react/macro'
import { format, setHours, setMinutes } from 'date-fns'
import { AlarmClockIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { Button } from '@penx/uikit/ui/button'
import { MobileCalendar } from '@penx/uikit/ui/mobile-calendar'
import { AnimateChangeInHeight } from '../AnimateChangeInHeight'
import { Drawer } from '../ui/Drawer'
import { IosPickerItem } from './IosPickerItem'
import './embla.css'
import { removeNotification } from '@/lib/removeNotification'
import { requestNotificationPermission } from '@/lib/requestPermission'
import { upsertNotification } from '@/lib/upsertNotification'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { ReminderTimePicker } from './ReminderTimePicker'

interface ItemProps {
  className?: string
  struct: Struct
  creation: Creation
  onClick?: () => void
}
export function Reminder({ className, struct, creation }: ItemProps) {
  const reminderColumn = struct.columns.find((c) => c.slug === 'reminder')!
  const value = creation.cells[reminderColumn?.id!]

  const initialDate = useMemo(() => {
    if (!value) return new Date()
    return new Date(value)
  }, [value])

  const initialTime = useMemo(() => {
    if (!value) return '00:00'
    return format(new Date(value), 'HH:mm')
  }, [value])

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Date | undefined>(initialDate)
  const [timeValue, setTimeValue] = useState<string>(initialTime)

  useEffect(() => {
    const value = creation.cells[reminderColumn?.id!]

    if (!value) {
      setTimeValue('00:00')
      setSelected(new Date())
      return
    }
    if (new Date(value).getTime() === selected?.getTime()) return

    const initialDate = useMemo(() => {
      if (!value) return new Date()
      return new Date(value)
    }, [value])

    const initialTime = useMemo(() => {
      if (!value) return ''
      return format(new Date(value), 'HH:mm')
    }, [value])

    setTimeValue(initialTime)
    setSelected(initialDate)
  }, [creation, setTimeValue, setSelected])

  const handleTimeChange = async (time: string) => {
    if (!selected) {
      setTimeValue(time)
      return
    }
    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10))
    const newSelectedDate = setHours(setMinutes(selected, minutes), hours)
    setSelected(newSelectedDate)
    setTimeValue(time)
  }

  const handleDaySelect = async (date: Date | undefined) => {
    if (!timeValue || !date) {
      setSelected(date!)
      return
    }
    const [hours, minutes] = timeValue
      .split(':')
      .map((str) => parseInt(str, 10))
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    )
    setSelected(newDate)
  }

  return (
    <>
      <div
        className="flex items-center gap-1 text-base"
        onClick={async () => {
          await requestNotificationPermission()
          setIsOpen(true)
        }}
      >
        <AlarmClockIcon size={20} />
        {value && format(new Date(value), 'MM/dd HH:mm')}
      </div>

      <Drawer
        open={isOpen}
        setOpen={(v) => {
          setSelected(initialDate)
          setTimeValue(initialTime)
          setIsOpen(v)
        }}
        isModalStyle
        className="overflow-hidden p-0"
      >
        <AnimateChangeInHeight>
          <DrawerHeader
            isModalStyle
            className="w-auto bg-white"
            showCancelButton
            onConfirm={async () => {
              impact()
              setIsOpen(false)
              const newCreation = await updateCreationProps(creation.id, {
                cells: {
                  ...creation.cells,
                  [reminderColumn.id]: selected,
                },
              })
              upsertNotification(struct, newCreation)
            }}
          >
            <DrawerTitle>
              <Trans>Reminder</Trans>
            </DrawerTitle>
          </DrawerHeader>
          <MobileCalendar
            className="p-0 px-1"
            mode="single"
            selected={selected}
            onSelect={async (date) => {
              impact()
              handleDaySelect(date)
            }}
          />
          <Popover></Popover>
          <ReminderTimePicker
            value={timeValue}
            onChange={(v) => {
              handleTimeChange(v)
              // setTimeValue(v)
            }}
          />

          {selected && timeValue && value && (
            <div className="flex gap-2 p-3">
              <Button
                className="flex-1"
                size="lg"
                variant="destructive"
                onClick={async () => {
                  impact()
                  setIsOpen(false)
                  await updateCreationProps(creation.id, {
                    cells: {
                      ...creation.cells,
                      [reminderColumn.id]: '',
                    },
                  })
                  removeNotification(creation.raw)
                }}
              >
                <Trans>Remove reminder</Trans>
              </Button>
            </div>
          )}
        </AnimateChangeInHeight>
      </Drawer>
    </>
  )
}
