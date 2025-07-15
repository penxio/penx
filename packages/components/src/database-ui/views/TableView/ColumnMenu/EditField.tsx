'use client'

import { FormEvent, forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { Trans } from '@lingui/react/macro'
import { IColumn } from '@penx/model-type'
import { ColumnType, Option } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { FieldSelectPopover } from '../FieldSelectPopover'
import { useEditColumnForm } from '../useEditColumnForm'
import { OptionListField } from './OptionListField'

interface EditFieldProps {
  column: IColumn
  onSave: () => void
  onCancel: () => void
  close: () => void
}
export function EditField({ column, onSave, onCancel, close }: EditFieldProps) {
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
      <div className="text-foreground/50 -mb-1 text-xs">
        <Trans>Display name</Trans>
      </div>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      <div className="text-foreground/50 -mb-1 text-xs">
        <Trans>Slug</Trans>
      </div>
      <Controller
        name="slug"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input size="sm" placeholder="" {...field} />}
      />

      <div className="text-foreground/50 -mb-1 text-sm">
        <Trans>Prop type</Trans>
      </div>

      <Controller
        name="columnType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <FieldSelectPopover {...field} />}
      />

      {column.columnType === ColumnType.SINGLE_SELECT && (
        <>
          <div className="text-foreground/50 text-xs">Options</div>
          <div className="max-h-[200px] overflow-y-auto py-1">
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
          <Trans>Cancel</Trans>
        </Button>
        <Button type="submit" size="sm">
          <Trans>Save</Trans>
        </Button>
      </div>
    </form>
  )
}
