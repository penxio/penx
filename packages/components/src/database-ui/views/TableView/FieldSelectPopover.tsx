import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { ChevronDown, RefreshCcw } from 'lucide-react'
import { ColumnType } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { FieldIcon } from '../../../FieldIcon'
import { useFieldTypeSelectPopover } from './hooks/useFieldTypeSelectPopover'

const textMap: Record<string, string> = {
  [ColumnType.TEXT]: 'Text',
  [ColumnType.NUMBER]: 'Number',
  // [FieldType.PASSWORD]: 'Password',
  [ColumnType.URL]: 'URL',
  [ColumnType.SINGLE_SELECT]: 'Single select',
  [ColumnType.MULTIPLE_SELECT]: 'Multiple select',
  [ColumnType.CREATED_AT]: 'Created At',
  [ColumnType.UPDATED_AT]: 'Updated At',
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
          <div className="flex h-9 items-center justify-between rounded border-e-red-50 px-3 text-sm">
            <div>{textMap[value]}</div>
            <div className="text-foreground/50">
              <ChevronDown size={16} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-[180px] p-0"
          // bgGray800--T20--dark
          // gray600
          // minW-180
          // cursorPointer
          // textXS
        >
          {Object.entries(ColumnType)
            .filter(([_, value]) =>
              [
                ColumnType.TEXT,
                ColumnType.NUMBER,
                ColumnType.PASSWORD,
                ColumnType.URL,
                ColumnType.SINGLE_SELECT,
                ColumnType.MULTIPLE_SELECT,
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
      className="text-foreground/80 hover:bg-foreground/100 flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm"
      {...rest}
    >
      {children}
    </div>
  )
}
