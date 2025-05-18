'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { IColumn } from '@penx/model-type'
import { Option } from '@penx/types'
import { useDatabaseContext } from '../../DatabaseProvider'

export type EditFieldValues = {
  name: string
  slug: string
  columnType: any
  options: Option[]
}

export function useEditColumnForm(column: IColumn) {
  const ctx = useDatabaseContext()
  const columnOptions = (column.options as any as Option[]) || []

  const form = useForm<EditFieldValues>({
    defaultValues: {
      name: column.name,
      slug: column.slug || '',
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
