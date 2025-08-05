'use client'

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { Struct } from '@penx/domain'
import { bgColorMaps } from '@penx/libs/color-helper'
import { localDB } from '@penx/local-db'
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
import { Switch } from '@penx/uikit/ui/switch'
import { cn } from '@penx/utils'
import { ColorSelector } from './ColorSelector'
import { useStructDialog } from './useStructDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  pluralName: z.string().min(1, { message: 'Plural name is required' }),
  type: z.string().min(1, { message: 'Unique code is required' }),
  showDetail: z.boolean().optional(),
  color: z.string().optional(),
})

interface Props {
  struct?: Struct
}
export function EditStructForm(props: Props) {
  const structDialog = useStructDialog()
  const { setIsOpen } = structDialog
  const struct = props.struct || structDialog.struct

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: struct?.name || '',
      pluralName: struct?.pluralName || '',
      type: struct?.type || '',
      showDetail: struct?.showDetail,
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
    await localDB.updateStructProps(struct.id, data)
    toast.info(t`Update struct successfully`)
    setIsOpen(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-full flex-1 flex-col space-y-4"
      >
        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">
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
                <FormLabel className="text-xs">
                  <Trans>Plural name</Trans>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
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
        /> */}

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">
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

          <FormField
            control={form.control}
            name="showDetail"
            render={({ field }) => (
              <FormItem className="flex w-full items-center justify-between">
                <FormLabel className="text-xs">
                  <Trans>Show detail panel</Trans>
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-auto">
          <Button type="submit" className="w-full px-4">
            <Trans>Update</Trans>
          </Button>
        </div>
      </form>
    </Form>
  )
}
