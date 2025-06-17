import { useState } from 'react'
import { impact } from '@/lib/impact'
import { t } from '@lingui/core/macro'
import { format } from 'date-fns'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { usePanelCreationContext } from '@penx/components/Creation/PanelCreationProvider'
import { FieldIcon } from '@penx/components/FieldIcon'
import { FileUpload } from '@penx/components/FileUpload'
import { useStructs } from '@penx/hooks/useStructs'
import { IColumn } from '@penx/model-type'
import { ColumnType } from '@penx/types'
import { AnimatedSwitch } from '@penx/uikit/components/AnimatedSwitch'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { Input } from '@penx/uikit/input'
import { cn } from '@penx/utils'
import { DateProp } from './DateProp'
import { MultipleSelectProp } from './MultipleSelectProp'
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
  const [eyeOn, setEyeOn] = useState(false)

  if (!struct.columns.length) return null
  if (column.isPrimary) return null
  const cells = creation.props.cells || {}
  const value = cells[column.id]

  return (
    <div className="flex h-12 gap-2 pl-3">
      <div className="text-foreground/60 flex w-fit items-center gap-2">
        <div className="bg-foreground/8 flex size-7 items-center justify-center rounded-md">
          <FieldIcon
            columnType={column.columnType}
            className="text-foreground"
          />
        </div>
        <span className="text-foreground text-base">{column.name}</span>
      </div>
      <div className="flex-1">
        {[ColumnType.PASSWORD].includes(column.columnType) && (
          <div className="flex h-full items-center gap-0 pr-3">
            <Input
              placeholder={t`Empty`}
              variant="unstyled"
              className="h-full text-right focus-visible:bg-transparent"
              type={eyeOn ? 'text' : 'password'}
              defaultValue={value}
              onChange={(e) => {
                onUpdateProps({
                  ...cells,
                  [column.id]: e.target.value,
                })
              }}
            />
            {!eyeOn && (
              <EyeIcon
                size={20}
                className="text-foreground/80"
                onClick={async () => {
                  setEyeOn(true)
                  impact()
                }}
              />
            )}
            {eyeOn && (
              <EyeOffIcon
                size={20}
                className="text-foreground/80"
                onClick={async () => {
                  setEyeOn(false)
                  impact()
                }}
              />
            )}
          </div>
        )}

        {[ColumnType.TEXT].includes(column.columnType) && (
          <Input
            placeholder={t`Empty`}
            variant="unstyled"
            className="h-full text-right focus-visible:bg-transparent"
            type="text"
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
          <DateProp
            value={value}
            onChange={(v) => {
              onUpdateProps({
                ...cells,
                [column.id]: v,
              })
            }}
          />
        )}

        {ColumnType.BOOLEAN === column.columnType && (
          <div className="flex h-full flex-1 items-center justify-end pr-2">
            <AnimatedSwitch
              checked={!!value}
              onChange={(checked) => {
                impact()
                onUpdateProps({
                  ...cells,
                  [column.id]: checked,
                })
              }}
            />
          </div>
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
            className="h-full text-right focus-visible:bg-transparent"
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
            placeholder="https://..."
            className="h-full text-right focus-visible:bg-transparent"
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
            className="ml-3 size-20"
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
