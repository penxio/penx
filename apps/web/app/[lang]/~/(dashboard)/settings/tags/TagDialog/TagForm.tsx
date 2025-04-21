'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { api } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useTagDialog } from './useTagDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export function TagForm() {
  const { refetch } = useSiteTags()
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, tag, index } = useTagDialog()
  const isEdit = !!tag

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isEdit ? tag.name : '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      await api.tag.updateTag.mutate({
        tagId: tag.id,
        ...data,
      })
      await refetch()
      form.reset()
      setIsOpen(false)
      toast.success(<Trans id="Updated successfully!"></Trans>)
    } catch (error) {
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <span>
              {isEdit ? <Trans id="Save"></Trans> : <Trans id="Add"></Trans>}
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
