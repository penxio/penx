import { ReactNode, useEffect, useMemo, useState } from 'react'
import { impact } from '@/lib/impact'
import { removeNotification } from '@/lib/removeNotification'
import { upsertNotification } from '@/lib/upsertNotification'
import { Trans } from '@lingui/react/macro'
import { format, setHours, setMinutes } from 'date-fns'
import { RepeatTypes } from '@penx/constants'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { ReminderState } from '@penx/libs/isReminder'
import { IColumn } from '@penx/model-type'
import { Button } from '@penx/uikit/ui/button'
import { MobileCalendar } from '@penx/uikit/ui/mobile-calendar'
import { cn } from '@penx/utils'
import { AnimateChangeInHeight } from '../AnimateChangeInHeight'
import { ReminderTimePicker } from '../ReminderTimePicker/ReminderTimePicker'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'

interface Props {
  creation: Creation
  column: IColumn
  value: ReminderState
  onChange?: (value: ReminderState) => void
  className?: string
  children: (props: { date?: Date }) => ReactNode
}
export const ReminderDrawer = ({
  value,
  children,
  className,
  column,
  creation,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false)

  const initialDate = useMemo(() => {
    if (!value?.date) return new Date()
    return new Date(value.date)
  }, [value])

  const initialTime = useMemo(() => {
    if (!value?.date) return '00:00'
    return format(new Date(value.date), 'HH:mm')
  }, [value])

  const initialRepeat = useMemo(() => {
    return value?.repeat || RepeatTypes.NONE
  }, [value])

  const [selected, setSelected] = useState<Date | undefined>(initialDate)
  const [timeValue, setTimeValue] = useState<string>(initialTime)
  const [repeat, setRepeat] = useState<string>(initialRepeat)

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

  useEffect(() => {
    if (!value) return
    const date = value?.date

    if (!date) {
      setTimeValue('00:00')
      setSelected(new Date())
    } else {
      if (new Date(date).getTime() !== selected?.getTime()) {
        setTimeValue(format(new Date(date), 'HH:mm'))
        setSelected(date)
      }
    }

    if (value?.repeat !== repeat) {
      setRepeat(value.repeat)
    }
  }, [value, setTimeValue, setSelected, setRepeat])

  return (
    <>
      <div
        className={cn('inline-flex', className)}
        onClick={async () => {
          impact()
          setOpen(true)
        }}
      >
        {children({ date: selected && value?.date ? selected : undefined })}
      </div>

      <Drawer
        open={open}
        setOpen={(v) => {
          // setSelected(initialDate)
          // setTimeValue(initialTime)
          setOpen(v)
        }}
        isModalStyle
        className="overflow-hidden p-0"
      >
        <AnimateChangeInHeight>
          <DrawerHeader
            className="w-auto bg-transparent"
            isModalStyle
            showCancelButton
            onConfirm={async () => {
              impact()
              setOpen(false)

              const newCreation = await updateCreationProps(creation.id, {
                cells: {
                  ...creation.cells,
                  [column.id]: {
                    date: selected,
                    repeat: RepeatTypes.NONE,
                  },
                },
              })
              upsertNotification(column, newCreation)
            }}
          >
            <DrawerTitle>Reminder</DrawerTitle>
          </DrawerHeader>
          <MobileCalendar
            className="p-0"
            mode="single"
            selected={selected}
            onSelect={async (v) => {
              impact()
              handleDaySelect(v)
            }}
          />

          <ReminderTimePicker
            value={timeValue}
            onChange={(v) => {
              handleTimeChange(v)
            }}
          />

          {selected && timeValue && value?.date && (
            <Button
              className="my-2 text-red-500"
              variant="ghost"
              onClick={async () => {
                impact()
                setOpen(false)

                const newCreation = await updateCreationProps(creation.id, {
                  cells: {
                    ...creation.cells,
                    [column.id]: '',
                  },
                })

                removeNotification(creation.raw)
              }}
            >
              <Trans>Remove reminder</Trans>
            </Button>
          )}
        </AnimateChangeInHeight>
      </Drawer>
    </>
  )
}
