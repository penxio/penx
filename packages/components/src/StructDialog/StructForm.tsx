'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { bgColorMaps } from '@penx/libs/color-helper'
import { localDB } from '@penx/local-db'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { NumberInput } from '@penx/uikit/NumberInput'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useDatabaseContext } from '../database-ui'
import { useStructDialog } from './useStructDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  pluralName: z.string().optional(),
  color: z.string().optional(),
})

export function StructForm() {
  const { struct, setIsOpen } = useStructDialog()

  const isEdit = !!struct
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: struct?.name || '',
      pluralName: struct?.pluralName || '',
      color: struct?.color || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isEdit) {
      const newStruct = produce(struct.raw, (draft) => {
        draft.props = {
          ...draft.props,
          ...data,
        }
      })

      store.structs.updateStruct(struct.id, newStruct)
      await localDB.updateStructProps(struct.id, data)
    } else {
      store.structs.createStruct(data.name)
    }

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
                <Trans id="Name"></Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEdit && (
          <>
            <FormField
              control={form.control}
              name="pluralName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    <Trans id="Plural name"></Trans>
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
                    <Trans id="Color"></Trans>
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
          </>
        )}

        <div>
          <Button size="sm" type="submit" className="px-4">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
}
function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const colorEntries = Object.entries(bgColorMaps)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {colorEntries.map(([color, bg]) => (
        <div
          key={color}
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:scale-x-105',
            value === color && 'bg-foreground/10',
          )}
          onClick={() => onChange(color)}
        >
          <div
            className={cn(
              'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
              bg,
              value === color && '',
            )}
          ></div>
        </div>
      ))}
    </div>
  )
}
