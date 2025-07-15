import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { t } from '@lingui/core/macro'
import { ChevronDown, RefreshCcw } from 'lucide-react'
import { ColumnType } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { FieldIcon } from '../../../FieldIcon'
import { useFieldTypeSelectPopover } from './hooks/useFieldTypeSelectPopover'

const textMap: Record<string, string> = {
  [ColumnType.TEXT]: t`Text`,
  [ColumnType.NUMBER]: t`Number`,
  [ColumnType.PASSWORD]: t`Password`,
  [ColumnType.URL]: t`URL`,
  [ColumnType.RATE]: t`Rate`,
  [ColumnType.SINGLE_SELECT]: t`Single select`,
  [ColumnType.MULTIPLE_SELECT]: t`Multiple select`,
  [ColumnType.DATE]: t`Date`,
  [ColumnType.CREATED_AT]: t`Created At`,
  [ColumnType.UPDATED_AT]: t`Updated At`,
}

interface Props {
  value: ColumnType
  onChange: (value: ColumnType) => void
}

export const FieldSelectPopover = forwardRef<HTMLDivElement, Props>(
  function FieldSelectPopover({ value, onChange }, ref) {
    const { isOpen, setIsOpen } = useFieldTypeSelectPopover()
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger ref={ref as any} asChild>
          <div className="border-foreground/10 flex h-9 items-center justify-between rounded-md border px-3 text-sm">
            <div>{textMap[value]}</div>
            <div className="text-foreground/50">
              <ChevronDown size={16} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent align="center" className="min-w-[180px] p-2">
          {Object.entries(ColumnType)
            .filter(([_, value]) =>
              [
                ColumnType.TEXT,
                ColumnType.NUMBER,
                ColumnType.URL,
                ColumnType.PASSWORD,
                ColumnType.SINGLE_SELECT,
                ColumnType.MULTIPLE_SELECT,
                ColumnType.RATE,
                ColumnType.DATE,
                ColumnType.CREATED_AT,
                ColumnType.UPDATED_AT,
              ].includes(value),
            )
            .map(([key, value]) => (
              <Item
                fieldType={ColumnType.TEXT}
                key={key}
                onClick={() => {
                  onChange(value)
                  setIsOpen(false)
                }}
              >
                <FieldIcon columnType={key as any} />
                <div>{textMap[key]}</div>
              </Item>
            ))}
        </PopoverContent>
      </Popover>
    )
  },
)

interface ItemProps extends PropsWithChildren {
  onClick: () => void
  fieldType: ColumnType
}

function Item({ children, fieldType, ...rest }: ItemProps) {
  return (
    <div
      className="text-foreground/80 hover:bg-foreground/10 flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm"
      {...rest}
    >
      {children}
    </div>
  )
}
