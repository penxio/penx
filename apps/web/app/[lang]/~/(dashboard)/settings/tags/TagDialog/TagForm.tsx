'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/ui/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/ui/components/form'
import { Input } from '@penx/ui/components/input'
import { useSiteTags } from '@/hooks/useSiteTags'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans, useLingui } from '@lingui/react/macro'
import { toast } from 'sonner'
import { z } from 'zod'
import { useTagDialog } from './useTagDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export function TagForm() {
  const { refetch } = useSiteTags()
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, tag, index } = useTagDialog()
  const { t } = useLingui()
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
      toast.success(t`Updated successfully!`)
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
                <Trans>Name</Trans>
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
            <span>{isEdit ? <Trans>Save</Trans> : <Trans>Add</Trans>}</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
