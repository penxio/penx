import { useCallback } from 'react'
import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { Creation, Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { ColumnType } from '@penx/types'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { Input } from '@penx/uikit/input'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { cn } from '@penx/utils'
import { FieldIcon } from '../../FieldIcon'
import { FileUpload } from '../../FileUpload'
import { usePanelCreationContext } from '../PanelCreationProvider'
import { DateProp } from './DateProp'
import { MultipleSelectProp } from './MultipleSelectProp'
import { PasswordProp } from './PasswordProp'
import { RateProp } from './RateProp'
import { SingleSelectProp } from './SingleSelectProp'

interface Props {
  column: IColumn
  struct: Struct
  creation?: Creation
  isPanel?: boolean
  onUpdateProps: (cells: any) => void
}

export const PropItem = ({
  onUpdateProps,
  struct,
  column,
  isPanel,
  ...rest
}: Props) => {
  const creation = rest.creation ?? usePanelCreationContext()

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
            placeholder={t`Empty`}
            variant={isPanel ? 'panel' : 'unstyled'}
            className=""
            type="text"
            // value={value ?? ''}
            defaultValue={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )
      case ColumnType.PASSWORD:
        return (
          <PasswordProp
            variant={isPanel ? 'panel' : 'unstyled'}
            value={value ?? ''}
            onChange={handleChange}
          />
        )
      case ColumnType.DATE:
        return (
          <DateProp
            struct={struct}
            column={column}
            isPanel={isPanel}
            value={value}
            onChange={handleChange}
          />
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
            placeholder={t`Empty`}
            variant="unstyled"
            precision={18}
            className=""
            defaultValue={value ?? ''}
            onChange={handleChange}
          />
        )
      case ColumnType.URL:
        return (
          <Input
            variant={isPanel ? 'panel' : 'unstyled'}
            placeholder={t`Empty`}
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
            isPanel={isPanel}
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.MULTIPLE_SELECT:
        return (
          <MultipleSelectProp
            struct={struct}
            isPanel={isPanel}
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
    <div
      className={cn(
        'flex items-center gap-2',
        isPanel && 'h-9 justify-between px-2',
      )}
    >
      <div className="text-foreground/60 flex w-32 items-center gap-1">
        {!isPanel && <FieldIcon columnType={column.columnType} />}
        <span className="">{column.name}</span>
      </div>
      <div className={cn('flex flex-1', isPanel && 'justify-end')}>
        {renderInput()}
      </div>
    </div>
  )
}
