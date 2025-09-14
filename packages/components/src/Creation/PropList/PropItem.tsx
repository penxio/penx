import { useCallback } from 'react'
import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { Creation, Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { IColumn } from '@penx/model-type'
import { ColumnType } from '@penx/types'
import { Switch } from '@penx/uikit/ui/switch'
import { cn } from '@penx/utils'
import { AIModelSelect } from '../../AIModelSelect'
import { FieldIcon } from '../../FieldIcon'
import { FileUpload } from '../../FileUpload'
import { usePanelCreationContext } from '../PanelCreationProvider'
import { AIModelSelectProp } from './AIModelSelectProp'
import { CodeEditorProp } from './CodeEditorProp'
import { DateProp } from './DateProp'
import { MultipleSelectProp } from './MultipleSelectProp'
import { NumberInputProp } from './NumberInputProp'
import { PasswordProp } from './PasswordProp'
import { RateProp } from './RateProp'
import { SingleSelectProp } from './SingleSelectProp'
import { TextareaProp } from './TextareaProp'
import { TextInputProp } from './TextInputProp'
import { UrlInputProp } from './UrlInputProp'

interface Props {
  column: IColumn
  struct: Struct
  creation?: Creation
  isPanel?: boolean
  containerWidth?: number
  onUpdateProps: (cells: any) => any
}

export const PropItem = ({
  onUpdateProps,
  struct,
  column,
  isPanel,
  containerWidth,
  ...rest
}: Props) => {
  const creation = rest.creation ?? usePanelCreationContext()

  if (!struct.columns.length) return null
  if (column.isPrimary) return null
  const cells = creation.props.cells || {}
  const value = cells[column.id]

  const handleChange = useCallback(
    async (v: any) => {
      await onUpdateProps({
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
          <TextInputProp
            variant={isPanel ? 'panel' : 'unstyled'}
            value={value}
            onChange={handleChange}
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

      case ColumnType.NUMBER:
        return (
          <NumberInputProp
            placeholder={t`Empty`}
            variant="unstyled"
            value={value ?? ''}
            onChange={handleChange}
          />
        )
      case ColumnType.URL:
        return (
          <UrlInputProp
            variant={isPanel ? 'panel' : 'unstyled'}
            placeholder={t`Empty`}
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.LONG_TEXT:
        return (
          <TextareaProp
            placeholder={t`Empty`}
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.CODE_EDITOR:
        return (
          <CodeEditorProp
            placeholder={t`Empty`}
            value={value}
            onChange={async (v) => {
              await handleChange(v)

              if (struct.isUserscript) {
                setTimeout(() => {
                  appEmitter.emit('UPDATE_USERSCRIPT_CODE')
                }, 0)
              }
            }}
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
      case ColumnType.MODEL_SELECT:
        return (
          <AIModelSelectProp
            isPanel={isPanel}
            value={value}
            onChange={handleChange}
          />
        )
      case ColumnType.RATE:
        return <RateProp value={value} onChange={handleChange} />

      case ColumnType.BOOLEAN:
        return (
          <Switch
            className="ml-auto"
            checked={!!value}
            onCheckedChange={handleChange}
          />
        )
      default:
        return null
    }
  }

  const isCol = [ColumnType.LONG_TEXT, ColumnType.CODE_EDITOR].includes(
    column.columnType,
  )
  return (
    <div
      className={cn(
        'flex items-center gap-x-2',
        isPanel && 'h-9 justify-between px-2',
        isCol && 'items-start',
        isCol && 'flex-col',
      )}
    >
      <div className="text-foreground/80 flex w-32 items-center gap-1">
        {!isPanel && <FieldIcon columnType={column.columnType} />}
        <span className="text-sm">{column.name}</span>
      </div>
      <div
        className={cn(
          'flex flex-1',
          isPanel && 'justify-end',
          isCol && 'w-full',
        )}
      >
        {renderInput()}
      </div>
    </div>
  )
}
