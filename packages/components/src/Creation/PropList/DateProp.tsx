import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { Command } from 'cmdk'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Struct } from '@penx/domain'
import { getBgColor } from '@penx/libs/color-helper'
import { IColumn } from '@penx/model-type'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'

interface Props {
  struct: Struct
  column: IColumn
  value: string | Date
  isPanel?: boolean
  onChange: (value: string | Date) => void
}
export const DateProp = ({
  column,
  struct,
  value,
  isPanel,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={isPanel ? 'xs' : 'default'}
          variant="ghost"
          className={cn('text-foreground flex items-center gap-1 px-3')}
        >
          <CalendarIcon
            size={isPanel ? 14 : 16}
            className={cn(!value && 'text-foreground/40')}
          />
          {value ? (
            format(new Date(value), 'PPP')
          ) : (
            <span className="text-foreground/40">
              <Trans>Pick a date</Trans>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align={isPanel ? 'end' : undefined}
      >
        <Calendar
          mode="single"
          selected={value ? new Date(value as string) : undefined}
          onSelect={(date) => {
            setOpen(false)
            onChange(date!)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
