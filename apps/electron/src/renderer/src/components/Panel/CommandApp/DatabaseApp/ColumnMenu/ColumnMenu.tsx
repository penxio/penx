'use client'

import { FormEvent, forwardRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from '@lingui/react/macro'
import { useDatabaseContext } from '@penx/components/DatabaseProvider'
import { IColumn } from '@penx/model-type'
import { ColumnType, Option } from '@penx/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { Menu, MenuItem } from '@penx/uikit/menu'
import { Button } from '@penx/uikit/ui/button'
import { FieldSelectPopover } from './FieldSelectPopover'
import { OptionListField } from './OptionListField'
import { useEditColumnForm } from './useEditColumnForm'

interface ColumnMenuProps {
  index?: number
  column: IColumn
  close: () => void
}

export type Data = {
  name: string
  slug: string
  columnType: any
  options: Option[]
}

export function ColumnMenu({ index = 0, column, close }: ColumnMenuProps) {
  const columnOptions = (column.options as any as Option[]) || []
  const ctx = useDatabaseContext()

  const form = useForm<Data>({
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

  async function onSubmit(data: Data) {
    await ctx.updateColumn(column.id, data)
    close()
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-1 flex-col gap-5 overflow-auto p-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground/50 text-xs">
                  <Trans>Display name</Trans>
                </FormLabel>
                <FormControl>
                  <Input size="sm" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground/50 text-xs">
                  <Trans>Slug</Trans>
                </FormLabel>
                <FormControl>
                  <Input size="sm" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="columnType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-foreground/50 text-xs">
                  <Trans>Prop type</Trans>
                </FormLabel>
                <FormControl>
                  <FieldSelectPopover {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {column.columnType === ColumnType.SINGLE_SELECT && (
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem className="max-h-[200px] w-full overflow-y-auto py-1">
                  <FormLabel className="text-foreground/50 text-xs">
                    <Trans>Options</Trans>
                  </FormLabel>
                  <FormControl>
                    <OptionListField {...field} column={column} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex w-full items-center justify-end gap-2 p-4">
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            size="sm"
            onClick={() => {
              close()
            }}
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button type="submit" size="sm" className="flex-1">
            <Trans>Save</Trans>
          </Button>
        </div>
      </form>
    </Form>
  )
}
