'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Column } from '@penx/db/client'
import { Option } from '@penx/types'
import { useDatabaseContext } from '../../DatabaseProvider'

export type EditFieldValues = {
  displayName: string
  name: string
  columnType: any
  options: Option[]
}

export function useEditColumnForm(column: Column) {
  const ctx = useDatabaseContext()
  const columnOptions = (column.options as any as Option[]) || []

  const form = useForm<EditFieldValues>({
    defaultValues: {
      displayName: column.displayName || '',
      name: column.name,
      columnType: column.columnType,
      options: columnOptions.map((o) => ({
        id: o.id,
        name: o.name,
        color: o.color,
      })),
    },
  })

  const onSubmit: SubmitHandler<EditFieldValues> = async (data) => {
    console.log('data', data)
    await ctx.updateColumn(column.id, data)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
