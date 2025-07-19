import { useCallback } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useStructs } from '@penx/hooks/useStructs'
import { IColumn } from '@penx/model-type'
import { ColumnType } from '@penx/types'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { Input } from '@penx/uikit/input'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { FieldIcon } from '../../FieldIcon'
import { FileUpload } from '../../FileUpload'
import { usePanelCreationContext } from '../PanelCreationProvider'
import { MultipleSelectProp } from './MultipleSelectProp'
import { PasswordProp } from './PasswordProp'
import { RateProp } from './RateProp'
import { SingleSelectProp } from './SingleSelectProp'

interface Props {
  column: IColumn
  onUpdateProps: (cells: any) => void
}

export const PropItem = ({ onUpdateProps, column }: Props) => {
  const creation = usePanelCreationContext()
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === creation.structId)!

  if (!struct.columns.length) return null
  if (column.isPrimary) return null
  const cells = creation.props.cells || {}
  const value = cells[column.id]

  const handleChange = useCallback(
    (v: any) => {
      onUpdateProps({
        ...cells,
        [column.id]: v,
      })
    },
    [cells, column.id, onUpdateProps],
  )

  const renderInput = () => {
    switch (column.columnType) {
      case ColumnType.TEXT:
        return (
          <Input
            placeholder=""
            variant="unstyled"
            className=""
            type="text"
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )
      case ColumnType.PASSWORD:
        return <PasswordProp value={value ?? ''} onChange={handleChange} />
      case ColumnType.DATE:
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn('text-foreground flex items-center gap-1 px-3')}
              >
                <CalendarIcon size={16} />
                {value ? (
                  format(new Date(value), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value as string) : undefined}
                onSelect={(date) => handleChange(date)}
              />
            </PopoverContent>
          </Popover>
        )
      case ColumnType.CREATED_AT:
        return (
          <div className="px-3 text-sm">
            {format(new Date(creation.createdAt), 'PPP')}
          </div>
        )
      case ColumnType.UPDATED_AT:
        return (
          <div className="px-3 text-sm">
            {format(new Date(creation.updatedAt), 'PPP')}
          </div>
        )
      case ColumnType.NUMBER:
        return (
          <NumberInput
            placeholder=""
            variant="unstyled"
            precision={18}
            className=""
            value={value ?? ''}
            onChange={handleChange}
          />
        )
      case ColumnType.URL:
        return (
          <Input
            variant="unstyled"
            placeholder=""
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )
      case ColumnType.IMAGE:
        return (
          <FileUpload
            className="ml-3 size-20"
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.SINGLE_SELECT:
        return (
          <SingleSelectProp
            struct={struct}
            column={column}
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.MULTIPLE_SELECT:
        return (
          <MultipleSelectProp
            struct={struct}
            column={column}
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.RATE:
        return <RateProp value={value} onChange={handleChange} />
      default:
        return null
    }
  }

  return (
    <div className="flex gap-2">
      <div className="text-foreground/60 flex w-32 items-center gap-1">
        <div>
          <FieldIcon columnType={column.columnType} />
        </div>
        <span className="text-sm">{column.name}</span>
      </div>
      <div className="flex-1">{renderInput()}</div>
    </div>
  )
}
