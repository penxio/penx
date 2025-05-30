'use client'

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { bgColorMaps } from '@penx/libs/color-helper'
import { db } from '@penx/pg'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { cn } from '@penx/utils'
import { ColorSelector } from './ColorSelector'
import { useStructDialog } from './useStructDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  pluralName: z.string().min(1, { message: 'Plural name is required' }),
  type: z.string().min(1, { message: 'Unique code is required' }),
  color: z.string().optional(),
})

export function EditStructForm() {
  const { struct, setIsOpen } = useStructDialog()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: struct?.name || '',
      pluralName: struct?.pluralName || '',
      type: struct?.type || '',
      color: struct?.color || '',
    },
  })
  const type = form.watch('type')

  useEffect(() => {
    if (!/^[A-Z]+$/.test(type)) {
      form.setValue(
        'type',
        type
          .toUpperCase()
          .trim()
          .replace(/[^(A-Z|0-9)]/g, ''),
      )
    }
  }, [type, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const newStruct = produce(struct.raw, (draft) => {
      draft.props = {
        ...draft.props,
        ...data,
      }
    })

    store.structs.updateStruct(struct.id, newStruct)
    await db.updateStructProps(struct.id, data)

    setIsOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Name</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pluralName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Plural name</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Unique code</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Color</Trans>
              </FormLabel>
              <FormControl>
                <ColorSelector
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="sm" type="submit" className="px-4">
            Update
          </Button>
        </div>
      </form>
    </Form>
  )
}
