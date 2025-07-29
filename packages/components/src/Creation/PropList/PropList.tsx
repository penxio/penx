import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { format } from 'date-fns'
import { CalendarDays, CalendarDaysIcon, CalendarIcon } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { PropItem } from './PropItem'

interface Props {
  className?: string
  struct: Struct
  creation: Creation
  onUpdateProps: (cells: any) => void
  isPanel?: boolean
}

export const PropList = ({
  struct,
  creation,
  onUpdateProps,
  className,
  isPanel,
}: Props) => {
  if (!struct) return null

  if (struct.columns.length < 2) return null
  return (
    <div className={cn('mt-4 flex flex-col gap-1', className)}>
      {struct.columns.map((column, i) => {
        return (
          <PropItem
            key={column.id}
            creation={creation}
            column={column}
            struct={struct}
            isPanel={isPanel}
            onUpdateProps={onUpdateProps}
          />
        )
      })}

      {struct.isTask && <TaskDate isPanel={isPanel} creation={creation} />}
    </div>
  )
}

interface TaskDateProps {
  creation: Creation
  isPanel?: boolean
}
function TaskDate({ creation, isPanel }: TaskDateProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn('flex gap-2', isPanel && 'h-8 px-2')}>
      <div className={cn('text-foreground/60 flex w-32 items-center gap-1')}>
        {!isPanel && (
          <CalendarDaysIcon className="text-foreground/70 inline-flex size-4" />
        )}
        <span className="leading-0">
          <Trans>Date</Trans>
        </span>
      </div>
      <div className="flex-1 justify-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size={isPanel ? 'xs' : 'default'}
              className={cn(
                'text-foreground ml-auto flex items-center gap-1 px-3',
              )}
            >
              <CalendarIcon size={isPanel ? 14 : 16} />
              {creation.date ? (
                format(new Date(creation.date), 'PPP')
              ) : (
                <Trans>Pick a date</Trans>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align={isPanel ? 'end' : undefined}
          >
            <Calendar
              mode="single"
              selected={
                creation.date ? new Date(creation.date as string) : undefined
              }
              onSelect={(date) => {
                setOpen(false)
                if (date) {
                  store.creations.updateCreationProps(creation.id, {
                    date: format(date, 'yyyy-MM-dd'),
                  })
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
