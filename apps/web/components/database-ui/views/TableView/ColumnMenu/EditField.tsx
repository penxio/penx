'use client'

import { FormEvent, forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { useDatabaseContext } from '@/components/database-ui/DatabaseProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ColumnType, Option } from '@/lib/types'
import { Trans } from '@lingui/react/macro'
import { Column } from '@penx/db/client'
import { ChevronDown, X } from 'lucide-react'
import { FieldSelectPopover } from '../FieldSelectPopover'
import { useEditColumnForm } from '../useEditColumnForm'

interface EditFieldProps {
  column: Column
  onSave: () => void
  onCancel: () => void
  close: () => void
}
export function EditField({ column, onSave, onCancel, close }: EditFieldProps) {
  const { database } = useDatabaseContext()
  const form = useEditColumnForm(column)
  const { control, formState } = form

  const onSubmit = async (formState: FormEvent<HTMLDivElement>) => {
    await form.onSubmit(formState)
    close()
  }

  return (
    <form
      className="flex flex-col gap-3 p-3"
      onSubmit={(formState) => onSubmit(formState as any)}
    >
      <div className="text-foreground/50 -mb-1 text-xs">Display name</div>
      <Controller
        name="displayName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      <div className="text-foreground/50 -mb-1 text-xs">
        <Trans>Area name</Trans>
      </div>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      {/* <div textXS gray500 mb--4>
        Type
      </div>

      <Controller
        name="fieldType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <FieldSelectPopover {...field} />}
      /> */}

      {column.columnType === ColumnType.SINGLE_SELECT && (
        <>
          <div className="text-foreground/50 text-xs">Options</div>
          <div className="-mx-4 max-h-[200px] overflow-auto px-4">
            <Controller
              name="options"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <OptionListField {...field} />}
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" type="button" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save
        </Button>
      </div>
    </form>
  )
}

interface OptionListFieldProps {
  value: Option[]
  onChange: (value: Option[]) => void
}

const OptionListField = forwardRef<HTMLDivElement, OptionListFieldProps>(
  function OptionListField({ value, onChange }, ref) {
    return (
      <div className="flex flex-col gap-2" ref={ref}>
        {value.map((item, index) => (
          <div key={item.id} className="flex items-center gap-1">
            <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-full">
              <ChevronDown size={16} />
            </div>
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
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                onChange(value.filter(({ id }) => id !== item.id))
              }}
            >
              <X />
            </Button>
          </div>
        ))}
      </div>
    )
  },
)
