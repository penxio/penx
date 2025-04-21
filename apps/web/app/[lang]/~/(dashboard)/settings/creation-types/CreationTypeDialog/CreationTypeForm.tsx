'use client'

import { useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { PlateEditor } from '@penx/editor/plate-editor'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { Button } from '@penx/uikit/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/ui/form'
import { Input } from '@penx/uikit/ui/input'
import { editorDefaultValue } from '@penx/constants'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { api, trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCreationTypeDialog } from './useCreationTypeDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Slug is required' }),
  props: z.any(),
})

export function CreationTypeForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, mold } = useCreationTypeDialog()
  const { refetch } = trpc.mold.list.useQuery()

  const isEdit = !!mold

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isEdit ? mold.name : '',
      type: isEdit ? mold.type : '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await api.mold.update.mutate({
        id: mold.id,
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
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Slug</Trans>
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
