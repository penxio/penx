'use client'

import { useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { editorDefaultValue } from '@penx/constants'
import { PlateEditor } from '@penx/editor/plate-editor'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useCreationTypeDialog } from './useCreationTypeDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Slug is required' }),
  props: z.any(),
})

export function CreationTypeForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, struct } = useCreationTypeDialog()
  const { refetch } = trpc.struct.list.useQuery()

  const isEdit = !!struct

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isEdit ? struct.name : '',
      type: isEdit ? struct.type : '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await api.struct.update.mutate({
        id: struct.id,
        ...data,
      })
      setIsOpen(false)
      await refetch()
      toast.success(isEdit ? 'Updated successfully!' : 'Added successfully!')
    } catch (error) {
      console.log('=======error:', error)

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
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
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Slug"></Trans>
              </FormLabel>
              <FormControl>
                <Input disabled placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            type="submit"
            className="w-24"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>{isEdit ? 'Update' : 'Add'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
