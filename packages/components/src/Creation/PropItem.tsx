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
import { FieldIcon } from '../FieldIcon'
import { FileUpload } from '../FileUpload'
import { MultipleSelectProp } from './MultipleSelectProp'
import { usePanelCreationContext } from './PanelCreationProvider'
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

  return (
    <div className="flex gap-2">
      <div className="text-foreground/60 flex w-32 items-center gap-1">
        <div>
          <FieldIcon columnType={column.columnType} />
        </div>
        <span className="text-sm">{column.name}</span>
      </div>
      <div className="flex-1">
        {[ColumnType.TEXT, ColumnType.PASSWORD].includes(column.columnType) && (
          <Input
            placeholder="Empty"
            variant="unstyled"
            className=""
            type={
              column.columnType === ColumnType.PASSWORD ? 'password' : 'text'
            }
            defaultValue={value}
            onChange={(e) => {
              onUpdateProps({
                ...cells,
                [column.id]: e.target.value,
              })
            }}
          />
        )}

        {[ColumnType.DATE].includes(column.columnType) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={cn('flex items-center gap-1 px-3')}>
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
                selected={new Date(value as string)}
                onSelect={(date) => {
                  onUpdateProps({
                    ...cells,
                    [column.id]: date,
                  })
                }}
              />
            </PopoverContent>
          </Popover>
        )}

        {ColumnType.CREATED_AT === column.columnType && (
          <div className="px-3 text-sm">
            {format(new Date(creation.createdAt), 'PPP')}
          </div>
        )}

        {ColumnType.UPDATED_AT === column.columnType && (
          <div className="px-3 text-sm">
            {format(new Date(creation.updatedAt), 'PPP')}
          </div>
        )}

        {column.columnType === ColumnType.NUMBER && (
          <NumberInput
            placeholder="Empty"
            variant="unstyled"
            precision={18}
            className=""
            defaultValue={value}
            onChange={(v) => {
              onUpdateProps({
                ...cells,
                [column.id]: v,
              })
            }}
          />
        )}
        {column.columnType === ColumnType.URL && (
          <Input
            variant="unstyled"
            placeholder="Empty"
            defaultValue={value}
            onChange={(e) => {
              onUpdateProps({
                ...cells,
                [column.id]: e.target.value,
              })
            }}
          />
        )}
        {column.columnType === ColumnType.IMAGE && (
          <FileUpload
            className="size-20 ml-3"
            value={value}
            onChange={(v) => {
              onUpdateProps({
                ...cells,
                [column.id]: v,
              })
            }}
          />
        )}
        {column.columnType === ColumnType.SINGLE_SELECT && (
          <SingleSelectProp
            struct={struct}
            column={column}
            value={value}
            onChange={(v) => {
              onUpdateProps({
                ...cells,
                [column.id]: v,
              })
            }}
          />
        )}

        {column.columnType === ColumnType.MULTIPLE_SELECT && (
          <MultipleSelectProp
            struct={struct}
            column={column}
            value={value}
            onChange={(v) => {
              onUpdateProps({
                ...cells,
                [column.id]: v,
              })
            }}
          />
        )}

        {column.columnType === ColumnType.RATE && (
          <RateProp
            value={value}
            onChange={(v) => {
              onUpdateProps({
                ...cells,
                [column.id]: v,
              })
            }}
          />
        )}
      </div>
    </div>
  )
}
