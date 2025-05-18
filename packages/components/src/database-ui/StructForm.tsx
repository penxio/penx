'use client'

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { editorDefaultValue } from '@penx/constants'
import { PlateEditor } from '@penx/editor/plate-editor'
import { bgColorMaps } from '@penx/libs/color-helper'
import { api, trpc } from '@penx/trpc-client'
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

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  pluralName: z.string().min(1, { message: 'Plural name is required' }),
  color: z.string(),
})

export function StructForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { struct, updateDatabase } = useDatabaseContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: struct.name || '',
      pluralName: struct.pluralName || '',
      color: struct.color || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    updateDatabase(data)
    setOpen(false)
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
                <ColorSelector {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="sm" type="submit" className="px-4">
            Save
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
            'h-6 w-6 cursor-pointer rounded-full transition-colors hover:scale-110',
            bg,
            value === color && 'ring-foreground/40 ring-2',
          )}
          title={color}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}
