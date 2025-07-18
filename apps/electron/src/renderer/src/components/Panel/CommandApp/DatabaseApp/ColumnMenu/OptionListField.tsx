'use client'

import { forwardRef } from 'react'
import { Trans } from '@lingui/react/macro'
import { ChevronDown, PlusIcon, XIcon } from 'lucide-react'
import { useDatabaseContext } from '@penx/components/DatabaseProvider'
import { getBgColor, getRandomColorName } from '@penx/libs/color-helper'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { Option } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { cn } from '@penx/utils'
import { ColorSelectPopover } from './ColorSelectPopover'

interface OptionListFieldProps {
  column: IColumn
  value: Option[]
  onChange: (value: Option[]) => void
}

export const OptionListField = forwardRef<HTMLDivElement, OptionListFieldProps>(
  function OptionListField({ value, column, onChange }, ref) {
    const { struct } = useDatabaseContext()
    return (
      <div className="flex flex-col gap-2" ref={ref}>
        {value.map((item, index) => (
          <div key={item.id} className="flex items-center gap-1">
            <ColorSelectPopover
              option={item}
              value={item.color}
              onChange={(v) => {
                const newOptions = [...value]
                newOptions[index].color = v
                onChange(newOptions)
              }}
            />
            <Input
              size="sm"
              placeholder=""
              value={item.name}
              onChange={(e) => {
                const newOptions = [...value]
                newOptions[index].name = e.target.value
                onChange(newOptions)
              }}
            />
            <Button
              className="size-7 shrink-0 rounded-md"
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                onChange(value.filter(({ id }) => id !== item.id))
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}
        <div
          className="text-brand flex cursor-pointer items-center justify-center gap-2"
          onClick={async () => {
            const { newOption } = await store.structs.addOption(
              struct,
              column.id,
              {
                color: getRandomColorName(),
              },
            )
            onChange([...value, newOption])
          }}
        >
          <PlusIcon size={20} />
          <div>
            <Trans>Add option</Trans>
          </div>
        </div>
      </div>
    )
  },
)
