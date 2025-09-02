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
import { Drawer } from '@penx/vaul'
import { FieldSelectPopover } from './FieldSelectPopover'
import { OptionListField } from './OptionListField'

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
        className="flex h-full flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="border-foreground/8 border-b px-4 py-2">
          <Drawer.Title className="font-medium ">{column?.name}</Drawer.Title>
          <Drawer.Description className="hidden"></Drawer.Description>
        </div>

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
                <FormItem className="w-fullpy-1">
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

        <div className="flex w-full items-center justify-end gap-2 px-4 pb-2 pt-1">
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
